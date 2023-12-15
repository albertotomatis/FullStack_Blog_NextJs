import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import createSlug from "@/utils/slug";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectMongoDB();
  const { title, content, author, category, imageUrl  } = await req.json();
  try {
    const existingPost = await Post.findOne({ title });
    const slug = createSlug(title);

    if (existingPost) {
      return NextResponse.json(
        { message: "Un post con lo stesso titolo esiste già" },
        { status: 409 }
      );
    }

    const newPost = new Post({
      title,
      content,
      author,
      slug,
      category,
      imageUrl,
    });

    await newPost.save();

    return NextResponse.json(
      { message: "Post creato con successo" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Errore nella creazione del post:", error);
    return NextResponse.json(
      { message: "Errore interno del server" },
      { status: 500 }
    );
  }
}
