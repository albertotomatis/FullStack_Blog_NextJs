import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import isUserAuthorizedForPost from "@/utils/authorization";

export async function GET(request) {
  await connectMongoDB();
  
  // Current page
  const page = parseInt(request.nextUrl.searchParams.get("page")) || 0;
  const postPerPage = 4;

  // Ottieni il numero totale di post disponibili
  const totalPosts = await Post.countDocuments();

  // Ordina i post in base alla data di creazione (createdAt) in ordine decrescente
  const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(page * postPerPage)
      .limit(postPerPage)
      .populate('author', 'name role avatarUrl');

  return NextResponse.json({ posts, totalPosts });
}


export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    // Ottieni la sessione dell'utente solo se è autenticato
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Utente non autenticato." },
        { status: 401 }
      );
    }

    await connectMongoDB();

    // Esegui una query per recuperare il post dal database
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

    // Recupera gli utenti che hanno il post nei preferiti
    const usersWithPostInFavorites = await User.find({ postPreferiti: id });

    // Rimuovi l'ID del post dall'array postPreferiti di ciascun utente
    const removalPromises = usersWithPostInFavorites.map(async (user) => {
      user.postPreferiti = user.postPreferiti.filter((postId) => postId !== id);
      await user.save();
    });

    // Aspetta che tutte le promise di salvataggio siano risolte
    await Promise.all(removalPromises);

    // Elimina il post dal database
    await Post.findByIdAndDelete(id);

    // Rimuovi l'ID del post dall'array postPreferiti dell'utente
    const user = await User.findById(session.user.id);
    user.postPreferiti = user.postPreferiti.filter(postId => postId.toString() !== id.toString());
    await user.save();

    // Recupera gli aggiornamenti dei post
    const updatedPosts = await Post.find().sort({ createdAt: -1 });

    // Restituisci la risposta JSON con gli aggiornamenti dei post
    return NextResponse.json({ posts: updatedPosts }, { status: 200 });
}
