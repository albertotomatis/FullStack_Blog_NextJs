import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const { title, content, author } = await req.json();

    if (!title || !content || !author) {
      return NextResponse.json(
        { message: "Assicurati di fornire tutti i campi richiesti: title, content e author." },
        { status: 400 }
      );
    }

    // Verifica se l'utente ha una sessione valida
    const session = await getServerSession(authOptions);
    /* INIZIO DEBUG */ 
    //console.log(session);
    //console.log("roleSession: " + session.user.role)
    /* FINE DEBUG */ 

    if (!session) {
      return NextResponse.json(
        { message: "Utente non autenticato." },
        { status: 401 } 
      );
    }

    // Verifica se l'utente ha il ruolo "admin"
    if (session.user.role !== "admin") {
        return NextResponse.json(
          { message: "Non sei autorizzato a creare post." },
          { status: 403 }
        );
    }

    await connectMongoDB();
    await Post.create({ title, content, author });
    return NextResponse.json({message: "Post creato."}, { status: 201 });
  } catch (error) {
    console.error("Errore nella creazione del post:", error);
    return NextResponse.json(
      { message: "Errore interno del server." },
      { status: 500 }
    );
  }
}
