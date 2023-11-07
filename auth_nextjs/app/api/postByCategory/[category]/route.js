import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectMongoDB();
  const match = req.url.match(/postByCategory\/([\w\s-]+)/);
  if (!match) {
    return NextResponse.json({ message: "Error" }, { status: 404 });
  }
  const category = match[1];
  try {
    const posts = await Post.find({ category: category });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
