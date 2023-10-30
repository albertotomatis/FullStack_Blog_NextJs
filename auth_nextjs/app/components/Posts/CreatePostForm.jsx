'use client';
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify"; 

export default function CreatePostForm() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

   // cancella gli errori
   const clearErrors = () => {
    setErrors({});
  }
  // all'invio del form per crea post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (title.trim() === "" || content.trim() === "") {
      setErrors({ message: "titolo e contenuto sono obbligatori" });
      return;
    }
    try {
      const res = await fetch("/api/createPost", {
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

      if (res.ok) {
        setTitle("");
        setContent("");
        clearErrors();
        setShowSuccessToast(true);
      } else {
        console.log('Creazione post fallita.');
      }
    } catch (error) {
      console.log('Errore durante la creazione del post:', error);
    }
  };

  useEffect(() => {
    if (showSuccessToast) {
      toast.success('Post creato!');
    }
  }, [showSuccessToast]);

  return (
    <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-[#51A6DB]">
          Crea un post
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleCreatePost} className="space-y-6">
          {/* Titolo */}
          <div>
            <label htmlFor="title" className="block text-sm font-bold leading-6 text-gray-900 px-2.5">
              Titolo
            </label>
            <div className="mt-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          {/* Contenuto */}
          <div>
            <label  className="block text-sm font-bold leading-6 text-gray-900 px-2.5">
              Contenuto
            </label>
            <div className="mt-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <button
            className="flex w-full justify-center rounded-md bg-[#ffbc5f] px-3 py-1.5 text-sm font-semibold leading-6 text-slate-900 hover:bg-[#51A6DB]"
            style={{
              borderBottom: '4px solid #020202',
              borderLeft: '4px solid #020202',
              borderTop: '1px solid #020202',
              borderRight: '1px solid #020202',
            }}>
            Crea Post
          </button>
          {errors.message && (
          <div className="bg-red-400 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
            {errors.message}
          </div>
        )}
        </form>
      </div>
    </div>
  );
}
