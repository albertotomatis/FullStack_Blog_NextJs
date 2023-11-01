import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export async function GET() {
    await connectMongoDB();
    const posts = await Post.find();
    return NextResponse.json({ posts });
}