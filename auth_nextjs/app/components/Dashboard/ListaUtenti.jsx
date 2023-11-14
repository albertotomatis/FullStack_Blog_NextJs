'use client';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import DeleteUser from "@/app/components/Dashboard/DeleteUser";

const ListaUtenti = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/listaUtenti`);
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

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8 pt-16">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm py-5">
          <button type="button" className="btn font-semibold rounded-lg text-sm px-4 py-2 text-center mr-5">
            <Link href="/creaPost" className="text-white hover:text-white">Crea post</Link>
          </button>
        </div>
        
        {session && session.user && session.user.role === "admin" && (
          <div>
            <h2 className="mb-4 text-4xl lg:text-5xl font-extrabold">Lista Utenti</h2>
            <ul>
              {users.map((user) => (
                <li key={user._id}>
                  <p>Nome: {user.name}</p>
                  <p>Email: {user.email}</p>
                  <p>Role: {user.role}</p>
                  <DeleteUser id={user._id} />
                </li>
              ))}
            </ul>
          </div>
        )}
        
      </div>
    </div>
  );
  
}

export default ListaUtenti;
