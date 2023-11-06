import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import createSlug from "@/utils/slug";

export async function POST(req) {
  try {
    const { title, content, author } = await req.json();
    // Genera il valore di slug dal titolo
    const slug = createSlug(title);

    if (!title || !content || !author) {
      return NextResponse.json(
        { message: "Assicurati di fornire tutti i campi richiesti" },
        { status: 400 }
      );
    }
    // Verifica se l'utente ha una sessione valida
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Utente non autenticato." },
        { status: 401 } 
      );
    }
    // Verifica se un post con lo stesso titolo esiste già
    const existingPost = await Post.findOne({ title });

    if (existingPost) {
      return NextResponse.json(
        { message: "Un post con lo stesso titolo esiste già nel database." },
        { status: 409 } // 409 Conflict HTTP status code
      );
    }

    // Verifica se l'utente ha il ruolo "admin"
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { message: "Accesso negato. Solo gli utenti con ruolo 'admin' possono creare post." },
        { status: 403 }
      );
    }

    await connectMongoDB();
    await Post.create({ title, content, author, slug });
    return NextResponse.json({ message: "Post creato." }, { status: 201 });
  } catch (error) {
    console.error("Errore nella creazione del post:", error);
    return NextResponse.json(
      { message: "Errore interno del server." },
      { status: 500 }
    );
  }
}
