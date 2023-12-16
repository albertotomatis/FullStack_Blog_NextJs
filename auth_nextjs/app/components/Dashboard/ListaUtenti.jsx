'use client';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Paginate from "@/app/components/Dashboard/Paginate";
import { toast } from "react-toastify";

const ListaUtenti = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all'); 
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/listaUtenti?role=${filter}`);
      const data = await response.json();
      setUsers(data.utenti);
      console.log("Fetched Data:", data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaveAvatarChanges = async () => {
    try {
      // Esegui la chiamata API per aggiornare l'avatar dell'utente connesso
      const response = await fetch('http://localhost:3000/api/updateAvatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          avatarUrl: document.getElementById('avatarInput').value,
        }),
      });

      if (response.ok) {
        setShowSuccessToast(true);
        console.log('Avatar aggiornato con successo');
      } else {
        console.error('Errore durante il salvataggio delle modifiche all\'avatar');
      }
    } catch (error) {
      console.error('Errore durante la richiesta di modifica dell\'avatar:', error);
    }
  };

  useEffect(() => {
    if (showSuccessToast) {
      toast.success("Avatar modificato!");
    }
  }, [showSuccessToast]);

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8 pt-16">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm py-5">
          <h1 className="mb-4  text-3xl lg:text-3xl font-extrabold">Hello, <span className="text-[#009688]">{session?.user?.name}</span> </h1>
          <button type="button" className="btn font-semibold rounded-lg text-sm px-4 py-2 text-center mr-5">
            <Link href="/creaPost" className="text-white hover:text-white">Crea post</Link>
          </button>
          {/* Modifica avatar */}
          {session?.user?.id && (
            <div className="mt-8">
              <h2 className="mb-4  text-2xl lg:text-2xl font-extrabold text-[#333]">Modifica Avatar</h2>
              <input
                type="text"
                id="avatarInput"
                placeholder="Nuovo URL Avatar"
                defaultValue={session.user.avatarUrl || ''}
                className="w-full border p-2 mb-4"
              />
              <button
                onClick={handleSaveAvatarChanges}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Salva Modifiche
              </button>
            </div>
          )}
        </div>
        {session && session.user.role === "admin" && (
          <Paginate users={users} role={filter} onRoleChange={setFilter} />
        )}
      </div>
    </div>
  );
}

export default ListaUtenti;