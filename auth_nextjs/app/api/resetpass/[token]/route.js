import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();
    await connectMongoDB();

    // Verifica se il token è valido nel database
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ message: "TokenExpired" }, { status: 400 });
    }

    // Hash della nuova password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Aggiorna la password dell'utente
    user.password = hashedPassword;

    // Cancella il token di reset
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;

    await user.save();

    // Genera un nuovo token di sessione JWT dopo la reimpostazione della password
    const newToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY_WITH_SALT, {
      expiresIn: '1h', // Scadenza del token (personalizzala)
    });
    
    // Invia il nuovo token con la risposta
    return NextResponse.json({ message: "Password reset successful", token: newToken }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while resetting the password." },
      { status: 500 }
    );
  }
}
