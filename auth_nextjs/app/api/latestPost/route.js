import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectMongoDB();
  
  // Ottiene il più recente ordinato per data di creazione (createdAt) in ordine decrescente
  const latestPost = await Post.findOne().sort({ createdAt: -1 }).populate('author', 'name role');

  if (!latestPost) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  return NextResponse.json({ latestPost});
}
