import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export async function GET(req) {
  // Estrai i parametri dalla URL utilizzando un'espressione regolare
  const match = req.url.match(/listaPost\/(\w+)/);

  if (!match) {
    return NextResponse.json({ message: "Error" }, { status: 404 });
  }

  const id = match[1]; // Estrai l'ID dall'espressione regolare

  await connectMongoDB();
  const post = await Post.findOne({ _id: id });
  if (!post) {
    return NextResponse.json({ message: "Error" }, { status: 404 });
  }

  return NextResponse.json({ message: "Success", post }, { status: 200 });
}

