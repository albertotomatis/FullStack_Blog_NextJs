'use client';
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify"; 

export default function CreatePostForm() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("next.js");
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
      setErrors({ message: "tutti i campi sono obbligatori" });
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
          author: session.user.id,
          category, // Includi l'ID dell'autore dalla sessione
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
      <div className="grid gap-4 mb-4 max-w-screen-xl items-center justify-between mx-auto w-2/6 bg-[#fdfdfd]  ombra-bordo">
        <div className="sm:col-span-3">
            <h2 className="mt-10 text-center text-3xl font-bold px-4">
              Crea Post
            </h2>
        </div>
        <div className="sm:col-span-3 sm:mx-14 mt-4">
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
          {/* Categoria */}
          <div className="mt-6">
              <label htmlFor="category" className="block text-sm font-bold leading-6 text-gray-900 px-2.5">
                Categoria
              </label>
              <div className="mt-2">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-2.5 mb-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6">
                  <option value="next.js">Next.js</option>
                  <option value="mongoDB">MongoDB</option>
                  <option value="react">React</option>
                  <option value="tailwind">Tailwind</option>
                </select>
              </div>
            </div>
          {/* Contenuto */}
          <div>
            <label className="block text-sm font-bold leading-6 text-gray-900 px-2.5">
              Contenuto
            </label>
            <div className="mt-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="4" className="block w-full rounded-md border-0 py-1.5 px-2.5 mb-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6"
              />
            </div> 
          </div>
          <div className="my-4">
            <button className="btn flex items-center justify-center mx-auto w-3/4 px-3 py-1.5 mb-10 rounded-lg text-sm font-semibold leading-6 text-slate-900">
              Crea Post
            </button>
          </div>
          {errors.message && (
  <div style={{ marginBottom: '2rem' }} className="bg-red-400 text-white flex items-center justify-center mx-auto w-2/4 px-3 py-1.5 text-sm font-semibold leading-6">
    {errors.message}
  </div>
)}

        </form>
      </div>
    </div>
    </div>
  );
}
