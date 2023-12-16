import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
      if (req.method !== 'POST') {
        return NextResponse.json(
          { message: "Metodo non consentito" },
          { status: 405 }
        );
      }
  
      await connectMongoDB();
  
      const { userId, avatarUrl } = await req.json();
  
      // Aggiorna l'avatar dell'utente nel database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { avatarUrl },
        { new: true }
      );
  
      if (!updatedUser) {
        return NextResponse.json(
          { message: "Utente non trovato" },
          { status: 404 }
        );
      }
  
      return NextResponse.json({ message: "Avatar aggiornato con successo" });
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dell\'avatar:', error);
      return NextResponse.json(
        { message: "Errore interno del server." },
        { status: 500 }
      );
    }
  }