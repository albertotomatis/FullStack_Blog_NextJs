import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";


export async function GET(request) {
  await connectMongoDB();
  const utenti = await User.find();

  // filtra utenti in base al ruolo
const role = request.nextUrl.searchParams.get('role') || 'all';

const filteredUsers = utenti.filter(user => {
  if (role === 'all') {
    return true;
  } else {
    return user.role === role;
  }
});
  return NextResponse.json({ utenti: filteredUsers }, { status: 200 });
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
