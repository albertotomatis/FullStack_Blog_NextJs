'use client';
import ReactPaginate from 'react-paginate';
import { useState } from "react";
import Link from "next/link";
import DeleteUser from "@/app/components/Dashboard/DeleteUser";
import { GoPersonAdd } from "react-icons/go";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { MdFilterListAlt } from "react-icons/md";

const Paginate = ({ users, role, onRoleChange  }) => {
    const filteredUsers = role === 'all' ? users : users.filter(user => user.role === role);
    const itemsPerPage = 4; // utenti per pagina nella tabella
    const [currentPage, setCurrentPage] = useState(0);
  
    // Calcola l'offset
    const offset = currentPage * itemsPerPage;
  
    // Calcola l'array degli utenti paginati
    const paginatedUsers = filteredUsers.slice(offset, offset + itemsPerPage);
  
    // Calcola il numero totale di utenti visualizzati
    const totalDisplayedUsers = offset + (paginatedUsers?.length || 0);
  
    const handlePageClick = ({ selected }) => {
      setCurrentPage(selected);
    };

  return (
    <div>
<h3 className="mb-4 mt-8 text-3xl lg:text-3xl font-extrabold">Lista Utenti</h3>
<table className="border-2-collapse border-2 w-full">
      <thead>
        <tr>
          <th className="border-2-2 p-3" colSpan="4">
            <span className="float-right">
            <Link href="/register"
              className="bg-[#4285f4] text-[#ffffff] text-md lg:text-md font-semibold inline-flex items-center px-3.5 py-1.5 m-2 rounded">
                <GoPersonAdd size={22} className="mr-2" /> Registra un nuovo utente
              </Link>
            </span>
            <div className="mb-4 mt-2 flex items-center">
              <span><MdFilterListAlt size={22} className="mr-2" /></span>
              <label htmlFor="roleFilter" className="mr-2">
                Filtra per ruolo:
              </label>
              <select
                id="roleFilter"
                className="border p-2 rounded-md font-normal"
                value={role}
                onChange={(e) => onRoleChange(e.target.value)}
              >
                <option value="all">Tutti</option>
                <option value="admin">Admin</option>
                <option value="author">Autori</option>
              </select>
            </div>
          </th>
        </tr>
              <tr>
                <th className="border-2 p-3">Nome</th>
                <th className="border-2 p-3">Email</th>
                <th className="border-2 p-3">Role</th>
                <th className="border-2 p-3">Azioni</th>
              </tr>
            </thead>
            {/* Corpo della tabella */}
            <tbody>
          {/* Mostra solo gli utenti paginati dalla lista filtrata */}
          {paginatedUsers.map((user, index) => (
        <tr key={user._id} className={index % 2 === 0 ? 'bg-green-100' : 'bg-white'}>
          <td className="border-2 p-3">{user.name}</td>
          <td className="border-2 p-3">{user.email}</td>
          <td className="border-2 p-3">{user.role}</td>
              <DeleteUser id={user._id} />
            </tr>
          ))}
        </tbody>
            {/* Footer */}
            <tfoot>
  <tr>
    <td colSpan="4" className="text-center">
      <div className="max-w-screen-xl mx-auto p-4 flex items-center justify-between">
        {/* Paginazione */ }
      <span className="mr-2">Utenti {`${totalDisplayedUsers} / ${users.length} `}</span>
        <div className="flex items-center m-2">
          <ReactPaginate
            pageCount={Math.ceil(filteredUsers.length / itemsPerPage)}
            onPageChange={handlePageClick}
            containerClassName="pagination flex space-x-6 items-center" 
            pageClassName="page-item hidden"
            pageLinkClassName="page-link"
            activeClassName="active"
            previousLabel={<button className="bg-[#009688] text-[#ffffff] text-md lg:text-md font-semibold inline-flex items-center px-3.5 py-1.5 rounded">
                <span><HiOutlineArrowNarrowLeft size={22} className="mr-2" /></span>Prev</button>}
            nextLabel={<button className="bg-[#009688] text-[#ffffff] text-md lg:text-md font-semibold inline-flex items-center px-3.5 py-1.5 rounded">
                Next<span><HiOutlineArrowNarrowRight size={22} className="ml-2" /></span> </button>}
          />
        </div>
      </div>
    </td>
  </tr>
</tfoot>
          </table>
          
          </div>
  );
};

export default Paginate;
