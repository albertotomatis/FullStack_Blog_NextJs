'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

export default function EditPostForm({ id, title, content }) {
  const [newTitle, setNewTitle] = useState(title);
  const [newContent, setNewContent] = useState(content);
  const [errors, setErrors] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Cancellazione degli errori quando si inizia a modificare il modulo
  const clearErrors = () => {
    setErrors({});
  };

  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTitle.trim() === "" || newContent.trim() === "") {
      setErrors({ message: "Titolo e contenuto sono obbligatori" });
      return;
    }

    try {
      // Effettua la richiesta di modifica
      const res = await fetch(`/api/modificaPost/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newTitle, newContent }),
      });

      if (!res.ok) {
        throw new Error("Failed to update post");
      }

      if (res.status === 409) {
        setErrors({ message: "Un post con lo stesso titolo esiste già nel database" });
      } else {
        setNewTitle("");
        setNewContent("");
        clearErrors();
        setShowSuccessToast(true);
        router.push("/blog");
      }
    } catch (error) {
      console.error("Errore durante la modifica del post:", error);
    }
  };

  useEffect(() => {
    if (showSuccessToast) {
      toast.success("Post modificato");
    }
  }, [showSuccessToast]);

  return (
    <section className="bg-gray-50 h-screen flex items-center justify-center">
      {session ? (
        session.user.role === "admin" ||
        (session.user.role === "author" && session.user.id === id) ? (
          <div className="w-full p-6 bg-white rounded-lg shadow-md:mt-0 sm:max-w-md sm:p-20 shadow-lg">
            <h2 className="mb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
              Modifica Post
            </h2>
            <form
              onSubmit={handleSubmit}
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
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              {/* Contenuto */}
              <div>
                <label className="block text-sm font-bold leading-6 text-gray-900 px-2.5">
                  Contenuto
                </label>
                <div className="mt-2">
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows="4"  className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <button className="btn flex w-full justify-center px-3 py-1.5 rounded-lg text-sm font-semibold leading-6 text-slate-900">
                Modifica Post
              </button>
              {errors.message && (
                <div className="bg-red-400 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                  {errors.message}
                </div>
              )}
            </form>
          </div>
        ) : (
          // l'utente è loggato ma non ha le autorizzazioni necessarie
          <p className="text-2xl font-medium">
            Non hai le autorizzazioni necessarie per modificare questo post.
          </p>
        )
      ) : (
        // Utente non autenticato
        <p className="text-2xl font-medium">
          Effettua il login per modificare questo post.
        </p>
      )}
    </section>
  );
}
