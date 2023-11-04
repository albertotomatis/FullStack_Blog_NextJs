'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; 

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTitle.trim() === "" || newContent.trim() === "") {
      setErrors({ message: "Titolo e contenuto sono obbligatori" });
      return;
    }

    try {
      // Effettua la richiesta di modifica
      const res = await fetch(`http://localhost:3000/api/modificaPost/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
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
        router.push('/blog');
      }
    } catch (error) {
      console.error('Errore durante la modifica del post:', error);
    }
  };

  useEffect(() => {
    if (showSuccessToast) {
      toast.success('Post modificato');
    }
  }, [showSuccessToast]);

  return (
    <div className="flex h-screen items-center justify-center w-full">
      <div className="bg-[#fdfdfd] rounded-lg shadow dark:border md:mt-0 sm:max-w-md md:px-8 md:py-8 xl:px-8 xl:py-8 ombra-bordo">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
          <h2 className="mt-5 text-center text-3xl font-bold px-4 sm:px-8 md:px-8">
            Edit Post
          </h2>
        </div>
        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <button className="btn flex w-full justify-center px-3 py-1.5 rounded-lg text-sm font-semibold leading-6 text-slate-900">
              Edit Post
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
