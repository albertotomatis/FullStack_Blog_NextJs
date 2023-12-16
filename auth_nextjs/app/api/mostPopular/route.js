import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectMongoDB();
  try {
    // Ottiene i due post con più "mi piace"
    const topLikedPosts = await Post.find()
      .sort({ likesCount: -1 }) // Ordina in ordine decrescente in base a likesCount
      .limit(2) 
      .populate('author', 'name role avatarUrl');
    return NextResponse.json({ topLikedPosts });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Errore interno del server" },
      { status: 500 }
    );
  }
}
