import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectMongoDB();

  // Ottiene gli ultimi 4 post ordinati per data di creazione (createdAt) in ordine decrescente
  const allRecentPosts = await Post.find()
    .sort({ createdAt: -1 })
    .limit(4)
    .populate('author', 'name role');

  // Esclude il primo post, prendi i successivi 3
  const recentPosts = allRecentPosts.slice(1, 4);

  // Restituisce la risposta JSON con gli ultimi 3 post escludendo il primo
  return NextResponse.json({ recentPosts });
}
