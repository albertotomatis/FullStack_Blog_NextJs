export default function isUserAuthorizedForPost(session, post) {
  console.log("Session:", session);
  console.log("Post author:", post.author);

  const isAuthorized = session && session.user && post.author.toString() === session.user.id;

  if (session.user && session.user.role === "admin") {
    console.log("Admin authorized");
    return true; // Gli amministratori sono autorizzati a modificare ed eliminare tutti i post
  }

  if (session.user && session.user.role === "author" && session.user.id === post.author.toString()) {
    return true; // L'utente è l'autore del post, quindi è autorizzato a modificarlo o eliminarlo
  }

  return false; // L'utente non è autorizzato a modificarlo
}