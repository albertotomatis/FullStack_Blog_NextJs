import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { token } = await req.json();
 
    await connectMongoDB();
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      // Token di verifica non valido
      return NextResponse.json({ message: "Token non valido" }, { status: 400 });
    }

    // Imposta l'email come verificata e rimuovi il token
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    return NextResponse.json({ message: "Email verificata con successo" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Errore durante la verifica della password." }, { status: 500 });
  }
}

