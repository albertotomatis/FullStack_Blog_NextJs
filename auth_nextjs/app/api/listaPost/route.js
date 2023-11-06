import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export async function GET() {
    await connectMongoDB();
    const posts = await Post.find();
    return NextResponse.json({ posts });
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await Post.findByIdAndDelete(id);
    return NextResponse.json({ message: "Post Deleted" }, {status: 200});
}