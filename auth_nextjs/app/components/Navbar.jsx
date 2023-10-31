'use client';
import Link from "next/link";
import { useSession, signOut } from 'next-auth/react';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const toggleAvatarMenu = () => {
    setIsAvatarMenuOpen(!isAvatarMenuOpen);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsAvatarMenuOpen(false);
  };

  const handleLogout = async () => {
    console.log('Logout button clicked');
    await signOut({ callbackUrl: '/' }); // Specifica l'URL di callback personalizzato
  };


  return (
    <nav className="bg-zinc-100 fixed w-full z-20 top-4 left-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 ">
        <Link href={'/'}>
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-slate-700">
          Developer
        </span>
        </Link>
        <div className="flex md:order-2">
          {session ? (
            <div className="relative">
              <button
                className="px-4 py-2 text-center mr-3 focus:outline-none"
                onClick={toggleAvatarMenu}
              >
                <div className="relative w-10 h-10 overflow-hidden bg-[#17e5b5] rounded-full dark:bg-[#17e5b5]">
                  <svg className="absolute w-12 h-12 text-gray-800 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                </div>

              </button>
              {isAvatarMenuOpen && (
                <div className="absolute z-10 mt-2 pb-3 pt-2 w-56 rounded-md shadow-lg bg-[#258ED9] text-zinc-50 right-0 left-auto"
                style={{
                  borderBottom: '4px solid black',
                  borderLeft: '4px solid black',
                  borderTop: '2px solid black',
                  borderRight: '2px solid black',
                }}>
                  <div className="grid grid-cols-1">
                    <div className="px-4 py-2">
                      <span className="block text-bold text-gray-900 dark:text-white">Hello, {session?.user?.name}</span>
                    </div>
                    <hr className="border-t border-sky-200 my-2" />
                    <Link href="/" className="block px-4 py-2 text-gray-900 hover-bg-gray-100 dark:hover-bg-gray-700 dark:text-white">
                      Dashboard
                    </Link>
                    <Link href="/" className="block px-4 py-2 text-gray-900 hover-bg-gray-100 dark:hover-bg-gray-700 dark:text-white">
                      Settings
                    </Link>
                    <Link href="/" onClick={handleLogout}
                      className="block px-4 py-2 text-gray-900 hover-bg-gray-100 dark:hover-bg-gray-700 dark:text-white">
                      Logout
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href={'/login'}>
             <button type="button" className="btn font-semibold rounded-lg text-sm px-4 py-2 text-center mr-5">
              Login
            </button>

            </Link>
          )}
          <button type="button" onClick={toggleMobileMenu} className="md:hidden text-slate-700 focus:outline-none dark:hover-bg-gray-700 ">
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
              </svg>
            )}
          </button>
        </div>
        <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMobileMenuOpen ? "block" : "hidden"}`}
        id="navbar-sticky">
          <ul className={`flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 font-medium dark:border-gray-700${
            isMobileMenuOpen ? "block mt-4" : "hidden"
          }`}>
            <li>
              <Link href="/admin-page" className="block py-2 pl-3 pr-4  rounded  md:hover-bg-transparent md:hover-text-blue-700 md:p-0 md:dark:hover-text-blue-500 text-slate-900   ">
                Admin Page
              </Link>
            </li>
            {session ? (
              <li>
                <Link href="/dashboard" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover-bg-gray-100 md:hover-bg-transparent md:hover-text-blue-700 md:p-0 md:dark:hover-text-blue-500 text-slate-900dark:hover-bg-gray-700 dark:hover-text-white md:dark:hover-bg-transparent dark.border-gray-700">
                  Dashboard
                </Link>
              </li>
            ) : (
              <li>
                <Link href="/" className="block py-2 pl-3 pr-4 rounded hover-bg-gray-100 md:hover-bg-transparent md:hover-text-blue-700 md:p-0 md:dark:hover-text-blue-500 text-slate-900 dark:hover-bg-gray-700 dark:hover-text-white md:dark:hover-bg-transparent dark.border-gray-700">
                  Link
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
      
    </nav>
  );
}
