'use client';
import React, { useState } from "react";
import { useSession } from "next-auth/react";

export default function CreatePostForm({  }) {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreatePost = async () => {
    if (!session || session.user.role !== "admin") {
      alert("Accesso negato. Solo gli utenti con ruolo 'admin' possono creare post.");
      return;
    }

    try {
      const response = await fetch("/api/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          author: session.user.id, // Includi l'ID dell'autore dalla sessione
        }),
      });

      if (response.status === 201) {
        const data = await response.json();
        console.log("Nuovo post creato:", data);

        // Reinizializza il modulo dopo la creazione del post
        setTitle("");
        setContent("");
      } else {
        console.error("Errore nella creazione del post.");
      }
    } catch (error) {
      console.error("Errore nella creazione del post:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center px-6 py-14 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">User info</h1>
    </div>
      <input
        type="text"
        placeholder="Titolo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Contenuto"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleCreatePost}>Crea Post</button>
    </div>
  );
}
