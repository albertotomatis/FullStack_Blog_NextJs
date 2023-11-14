import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";


await connectMongoDB();

export async function GET(request) {
  const utenti = await User.find();
  return NextResponse.json({ utenti });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");

  const user = await User.findById(id);

  if (!user) {
    return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
  }

  await User.findByIdAndDelete(id);
  return NextResponse.json({ user }, { status: 200 });
}


