'use client';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import htmlSanitizer from "@/utils/sanitizeHtml";

export default function CreatePostForm() {
  // Quill Editor
  var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], 
    ['link'],  
  ];
  const module = {
      toolbar: toolbarOptions,
  }

  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("next.js");
  const [errors, setErrors] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Cancella gli errori
  const clearErrors = () => {
    setErrors({});
  };

  // All'invio del form per creare il post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (title.trim() === "" || content.trim() === "") {
      setErrors({ message: "Tutti i campi sono obbligatori" });
      return;
    }

    // Sanifica il contenuto prima di inviarlo al server
  const sanitizedContent = htmlSanitizer(content);

    try {
      const res = await fetch("/api/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: sanitizedContent, // Utilizza il contenuto sanificato
          author: session.user.id,
          category, // Includi l'ID dell'autore dalla sessione
        }),
      });

      if (res.status === 409) {
        // Il titolo è duplicato, mostra un errore
        setErrors({
          message: "Un post con lo stesso titolo esiste già nel database",
        });
      } else if (res.ok) {
        setTitle("");
        setContent("");
        clearErrors();
        setShowSuccessToast(true);
      } else {
        console.log("Creazione post fallita.");
      }
    } catch (error) {
      console.log("Errore durante la creazione del post:", error);
    }
  };

  useEffect(() => {
    if (showSuccessToast) {
      toast.success("Post creato!");
    }
  }, [showSuccessToast]);

  return (
    <section className="bg-gray-50 h-screen flex items-center justify-center">
      {session ? (
        session.user.role === "admin" || session.user.role === "author" ? (
          <div className="w-full p-6 bg-white rounded-lg shadow-md:mt-0 sm:max-w-md sm:p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
              Crea Post
            </h2>
            <form
              onSubmit={handleCreatePost}
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              action="#"
              method="POST"
            >
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
                    className="block w-full rounded-md border-0 py-1.5 px-2.5 mb-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6"
                  >
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
                <div className="mt-2">
                  <ReactQuill 
                  modules={module}
                  theme="snow" 
                  value={content}
                  onChange={setContent}
                  className="block w-full rounded-md border-0 py-1.5 px-2.5 mb-10 text-gray-900  placeholder:text-gray-400  sm:text-sm sm:leading-6"
                  />
                </div>
                </div>
              </div>
              <div className="my-4">
                <button className="btn flex items-center justify-center mx-auto w-3/4 px-3 py-1.5 mb-10 rounded-lg text-sm font-semibold leading-6">
                  Crea Post
                </button>
              </div>
              {errors.message && (
                <div
                  style={{ marginBottom: "2rem" }}
                  className="bg-red-400 text-white flex items-center justify-center mx-auto w-2/4 px-3 py-1.5 text-sm font-semibold leading-6"
                >
                  {errors.message}
                </div>
              )}
            </form>
          </div>
        ) : (
          // L'utente è loggato ma non ha le autorizzazioni necessarie
          <p className="text-2xl font-medium">
            Non hai le autorizzazioni necessarie per creare questo post.
          </p>
        )
      ) : (
        // Utente non autenticato
        <p className="text-2xl font-medium">
          Effettua il login per creare un post.
        </p>
      )}
    </section>
  );
}
