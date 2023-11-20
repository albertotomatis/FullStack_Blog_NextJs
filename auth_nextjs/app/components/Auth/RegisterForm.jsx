'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { validateFormData, handleInputChange } from "@/app/components/Auth/Validation";
import { isValidEmail, isValidName } from "@/utils/validation";
import { HiEye, HiEyeOff } from 'react-icons/hi';

export default function RegisterForm() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Validazioni mentre l'utente digita
  const handleChange = (e) => {
    handleInputChange(e, formData, setFormData, errors, setErrors, isValidEmail, isValidName);
  }

  // Mostra o nasconde la password
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // Alla sottomissione del modulo
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateFormData(formData);
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    // Invia i dati al server
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        // Reindirizza a /email-verification solo dopo una registrazione riuscita
        router.push('/email-verification');
      } else if (res.status === 400) {
        // Gestisci il caso in cui l'email esiste già
        const errorData = await res.json();
        setErrors({ email: errorData.message });
      } else {
        console.log('Registrazione utente fallita.');
      }
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
    }
  };

  return (
    <section className="bg-gray-50 h-screen flex items-center justify-center">
      <div className="w-full p-6 bg-white rounded-lg shadow-md:mt-0 sm:max-w-md sm:p-20 shadow-lg">
        <h2 className="mb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
          Registrazione
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#" method="POST">
          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-bold leading-6 text-gray-900 px-2.5">
              Nome
            </label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                name="name"
                type="text"
                className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6"
              />
              {errors.name && (
                <p className="text-red-400 font-bold w-fit text-sm py-1 px-3 rounded-md mt-2">
                  {errors.name}
                </p>
              )}
            </div>
          </div>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-bold leading-6 text-gray-900 px-2.5">
              Email
            </label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                name="email"
                type="text"
                className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6"
              />
              {errors.email && (
                <p className="text-red-400 font-bold w-fit text-sm py-1 px-3 rounded-md mt-2">
                  {errors.email}
                </p>
              )}
            </div>
          </div>
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-bold leading-6 text-gray-900 px-2.5">
              Password
            </label>
            <div className="mt-2 relative" style={{ height: '2.5rem' }}>
              <input
                onChange={handleChange}
                name="password"
                type={passwordVisible ? 'text' : 'password'}
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-700"
              >
                {passwordVisible ? <HiEye /> : <HiEyeOff />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 font-bold w-fit text-sm py-1 px-3 rounded-md mt-2">
                {errors.password}
              </p>
            )}
          </div>
          {/* Ruolo */}
          {isAdmin && (
            <div>
              <label htmlFor="role" className="block text-sm font-bold leading-6 text-gray-900 px-2.5">
                Ruolo
              </label>
              <div className="mt-2">
                <select
                  onChange={handleChange}
                  name="role"
                  className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6"
                >
                  <option value="admin">Admin</option>
                  <option value="author">Author</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>
          )}
          <div>
            <button
              type="submit"
              className="btn flex w-full justify-center px-3 py-1.5 rounded-lg text-sm font-semibold leading-6 text-slate-900"
            >
              Registra
            </button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm font-bold text-gray-500">
          Già registrato? <Link href={'/login'} className="font-bold leading-6 text-[#51A6DB] hover:text-sky-900">Login</Link>
        </p>
      </div>
    </section>
  );
}
