'use client';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import DeleteUser from "@/app/components/Dashboard/DeleteUser";
import { GoPersonAdd } from "react-icons/go";

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
        <h1 className="mb-4 mt-8 text-3xl lg:text-3xl font-extrabold">Hello, <span className="text-[#009688]">{session?.user?.name}</span> </h1>
        <button type="button" className="btn font-semibold rounded-lg text-sm px-4 py-2 text-center mr-5">
          <Link href="/creaPost" className="text-white hover:text-white">Crea post</Link>
        </button>
      </div>
        
        {session && session.user && session.user.role === "admin" && (
  <div>
    <h3 className="mb-4 mt-8 text-3xl lg:text-3xl font-extrabold hover:text-white">Lista Utenti</h3>
    <table className="border-2-collapse border-2 w-full">
      <thead>
        <tr>
          <th className="border-2-2 p-3" colSpan="4">
            <span className="float-right">
            <Link href="/register"
              className="bg-[#4285f4] text-[#ffffff] text-md lg:text-md font-semibold inline-flex items-center px-3.5 py-1.5 rounded">
                <GoPersonAdd size={22} className="mr-2" /> Registra un nuovo utente
              </Link>
            </span>
          </th>
        </tr>
        <tr>
          <th className="border-2 p-3">Nome</th>
          <th className="border-2 p-3">Email</th>
          <th className="border-2 p-3">Role</th>
          <th className="border-2 p-3">Azioni</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={user._id} className={index % 2 === 0 ? 'bg-green-100' : 'bg-white'}>
            <td className="border-2 p-3">{user.name}</td>
            <td className="border-2 p-3">{user.email}</td>
            <td className="border-2 p-3">{user.role}</td>
            <td className="border-2 p-3">
              <DeleteUser id={user._id} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      </div>
    </div>
  );
  
}

export default ListaUtenti;
