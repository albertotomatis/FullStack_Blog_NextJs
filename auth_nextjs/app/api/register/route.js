import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import crypto from 'crypto';
import { isValidEmail, isValidName } from "@/utils/validation";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.user_mailtrap,
      pass: process.env.pass_mailtrap,
    },
  });

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();
    await connectMongoDB();

    // Verifica se il nome è valido
    if (!isValidName(name)) {
      return NextResponse.json(
        { message: "Nome non valido." },
        { status: 400 }
      );
    }

    // Verifica se l'email è valida
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

    try {
      await transporter.sendMail({
        from: process.env.user_ethereal_email,
        to: email,
        subject: 'Conferma l\'indirizzo email',
        text: `Clicca sul seguente link per confermare il tuo indirizzo email: ${resetLink}`,
      });
    } catch (emailError) {
      console.error('Errore durante l\'invio dell\'email di verifica:', emailError);
      return NextResponse.json(
        { message: "Errore durante l'invio dell'email di verifica." },
        { status: 500 }
      );
    }
    const user = await User.create({ name, email, password: hashedPassword, role, emailVerificationToken: verificationToken });

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
