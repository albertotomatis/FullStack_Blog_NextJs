export default function isUserAuthorizedForPost(session, post) {
    if (session.user.role === "admin") {
      return true; // Gli amministratori sono autorizzati a modificare ed eliminare tutti i post
    }
  
    if (session.user.role === "author" && session.user.id === post.author) {
      return true; // L'utente è l'autore del post, quindi è autorizzato a modificarlo o eliminarlo
    }
  
    return false; // L'utente non è autorizzato a modificarlo
  }
