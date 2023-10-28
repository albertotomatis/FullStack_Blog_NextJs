'use client';
import { useSession } from 'next-auth/react';

const AdminPage = () => {
  const { data: session } = useSession();

  // Controlla se l'utente è autenticato e ha il ruolo "admin"
  if (session && session.user && session.user.role === 'admin') {
    return (  
        <div className="flex flex-col justify-center px-6 py-14 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Admin Page</h1>
            </div>  
        </div>
    );
  }

  // Se l'utente non è autenticato o non è un admin, reindirizzalo
  return (
    <div className="flex flex-col justify-center px-6 py-14 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h1 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Devi essere un admin per accedere a questa pagina.
            </h1>
            </div>  
        </div>
  );
};

export default AdminPage;
