import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import createSlug from "@/utils/slug";
import isUserAuthorizedForPost from "@/utils/authorization";

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

export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const { newTitle, newContent } = await request.json();
    const slug = createSlug(newTitle);

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Utente non autenticato." },
        { status: 401 }
      );
    }

    await connectMongoDB();
    const post = await Post.findOne({ _id: id });
 
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (!isUserAuthorizedForPost(session, post)) {
      return NextResponse.json(
        { message: "Accesso negato. L'utente non ha le autorizzazioni necessarie." },
        { status: 403 }
      );
    }

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
