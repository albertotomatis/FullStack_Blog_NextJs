import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export async function GET(req) {
  const id = req.url.split("listaPost/")[1];
  await connectMongoDB();
  const post = await Post.findOne({_id: id});
  if(!post) {
    return NextResponse.json({ message: "Error" }, {status: 404});
  }
  /* INIZIO DEBUG */
  //console.log(post);
  /* FINE DEBUG */
  return NextResponse.json({ message: "Ok", post }, {status: 200});
  
}
