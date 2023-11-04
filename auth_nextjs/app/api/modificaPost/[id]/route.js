import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;
  try {
    await connectMongoDB();
    const post = await Post.findOne({ _id: id });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// genera uno slug dal titolo
const createSlug = (title) => {
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, '-') // Sostituisci spazi con trattini
    .replace(/[^a-z0-9-]/g, '') // Rimuovi caratteri non validi
    .replace(/-+$/, '') // Rimuovi eventuali trattini finali
    .substring(0, 100); // Limita la lunghezza del `slug` se necessario
  return slug;
};

export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const { newTitle, newContent } = await request.json();
    const slug = createSlug(newTitle);
    await connectMongoDB();
    const updatedPost = await Post.findByIdAndUpdate(id, { title: newTitle, content: newContent, slug });

    if (!updatedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Post Updated" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
