import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.user_mailtrap,
    pass: process.env.pass_mailtrap,
  },
});

// Funzione di validazione dell'email
function isValidEmail(email) {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();
    await connectMongoDB();

    // Verifica se l'email è valido
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Indirizzo email non valido." },
        { status: 400 }
      );
    }

    // Verifica se l'email esiste già nel database prima di creare un nuovo utente
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists." },
        { status: 400 } 
      );
    }

    // Genera un token di verifica casuale
    const verificationToken = crypto.randomBytes(16).toString('hex');

    // Creazione dell'utente con il token di verifica
    const saltRounds = 10; // Numero di rounds di hashing per il salt
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const resetLink = `http://localhost:3000/email-verification-success?token=${verificationToken}`;

    const user = await User.create({ name, email, password: hashedPassword, role, emailVerificationToken: verificationToken });

    // Invia l'email di verifica
    await transporter.sendMail({
      from: process.env.user_ethereal_email,
      to: email,
      subject: 'Conferma l\'indirizzo email',
      text: `Clicca sul seguente link per confermare il tuo indirizzo email: ${resetLink}`,
    });

    // Reindirizza l'utente alla pagina di verifica dell'email
    return NextResponse.redirect('http://localhost:3000/email-verification-success');
  } catch (error) {
    console.error(error); // Registra l'errore per una migliore diagnosi
    return NextResponse.json(
      { message: "Errore interno del server." },
      { status: 500 }
    );
  }
}
