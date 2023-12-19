import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export async function GET(req) {
  // Estrae i parametri dalla URL utilizzando un'espressione regolare
  // l'espressione regolare, ([\w\s-]+) cattura parole alfanumeriche, spazi e trattini.
  const match = req.url.match(/listaPost\/([\w\s-]+)/);

  if (!match) {
    return NextResponse.json({ message: "Error" }, { status: 404 });
  }

  const slug = match[1]; // Estrae lo slug dall'espressione regolare

  await connectMongoDB();
  const post = await Post.findOne({ slug: slug }).populate('author', 'name role avatarUrl');

  if (!post) {
    return NextResponse.json({ message: "Error" }, { status: 404 });
  }

  return NextResponse.json({ message: "Success", post }, { status: 200 });
}
