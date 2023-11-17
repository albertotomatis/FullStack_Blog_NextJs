import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectMongoDB();
    const { userId, postId } = await req.json();

  try {
    const user = await User.findById(userId);
    if (!user) {
        return NextResponse.json(
          { message: "Utente non trovato" },
          { status: 404 }
        );
      }
  
if (user.postPreferiti && user.postPreferiti.includes(postId)) {
    return NextResponse.json(
      { message: "Il post è già nei preferiti" },
      { status: 400 }
    );
  }
  // Aggiunge il post ai preferiti
  user.postPreferiti = user.postPreferiti || [];
  user.postPreferiti.push(postId);
  await user.save();

  return NextResponse.json(
    { message: "Post aggiunto ai preferiti con successo" },
    { status: 200 }
  );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
        { message: "Errore interno del server" },
        { status: 500 }
      );
  }
}
