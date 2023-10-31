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

      if (res.status === 409) {
        // Il titolo è duplicato, mostra un errore
        setErrors({ message: "Un post con lo stesso titolo esiste già nel database" });
        } else if (res.ok) {
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
    <div className="flex h-screen items-center justify-center w-full">
      <div className="bg-[#fdfdfd] rounded-lg shadow dark:border md:mt-0 sm:max-w-md md:px-8 md:py-8 xl:px-8 xl:py-8  ombra-bordo">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
          <h2 className="mt-5 text-center text-3xl font-bold px-4 sm:px-8 md:px-8">
            Crea Post
          </h2>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm p-4 sm:p-6 md:p-8">
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
            className="btn flex w-full justify-center px-3 py-1.5 rounded-lg text-sm font-semibold leading-6 text-slate-900">
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
    </div>
  );
}
