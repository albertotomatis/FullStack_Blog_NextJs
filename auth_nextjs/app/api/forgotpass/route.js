import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();
    await connectMongoDB();

    const userEmail = await User.findOne({ email });
    if (!userEmail) {
      return NextResponse.json(
        { message: "Email errata o non esistente." },
        { status: 400 }
      );
    }

    // Crea un token utilizzando la chiave segreta
    const tokenPayload = { email: email };
    const chiaveSegreta = process.env.SECRET_KEY_WITH_SALT;
    const token = jwt.sign(tokenPayload, chiaveSegreta, { expiresIn: "1h" });
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // Memorizza il token e la data di scadenza nel documento utente nel database
    const resetToken = token; // Token casuale sicuro
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Scadenza dopo 1 ora

    await User.updateOne(
      { email: email }, // Filtra l'utente tramite l'indirizzo email
      {
        $set: {
          passwordResetToken: resetToken,
          passwordResetTokenExpiry: resetTokenExpiry,
        },
      }
    );

    // Configurazione transporter per l'invio delle email
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.user_mailtrap,
        pass: process.env.pass_mailtrap,
      },
    });

    // Invia il token per email
    const mailOptions = {
      from: process.env.user_ethereal_email,
      to: email,
      subject: "Reset Password",
      text: `Clicca sul seguente link per reimpostare la password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email di reset password inviata con successo." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Errore durante il recupero della password." },
      { status: 500 }
    );
  }
}
