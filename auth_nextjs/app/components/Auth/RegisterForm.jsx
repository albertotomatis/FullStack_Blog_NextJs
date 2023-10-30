'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from "next-auth/react";
import { validateFormData, handleInputChange } from "@/app/components/Auth/Validation";
import { isValidEmail, isValidName } from "@/utils/validation";
import { HiEye, HiEyeOff } from 'react-icons/hi';

export default function RegisterForm() {

  const { data:session } = useSession();
  const isAdmin = session?.user?.role === 'admin'; 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // validazioni mentre l'utente digita
  const handleChange = (e) => {
    handleInputChange(e, formData, setFormData, errors, setErrors, isValidEmail, isValidName);
  }

  // show - hide password
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // all'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateFormData(formData);
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    // Invia i dati al server
    try {
      const res = await fetch('api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        setShowSuccessToast(true); // Mostra la notifica di successo
      } else if (res.status === 400) {
        // Gestisci il caso in cui l'email esiste già
        const errorData = await res.json();
        setErrors({ email: errorData.message });
      } else {
        console.log('User registration failed.');
      }
    } catch (error) {
      console.log('Error during registration:', error);
    }
  };

  useEffect(() => {
    if (showSuccessToast) {
      toast.success('User registration success.');
    }
  }, [showSuccessToast]);

  return (
    <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-[#51A6DB]">
          Create an account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */ }
          <div>
            <label htmlFor="name" className="block text-sm font-bold leading-6 text-gray-900 px-2.5">
              Name
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
          {/* Email */ }
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
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
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
          {/* Role */}
          {isAdmin && (
            <div>
              <label htmlFor="role" className="block text-sm font-bold leading-6 text-gray-900 px-2.5">
                Role
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
              className="flex w-full justify-center rounded-md bg-[#ffbc5f] px-3 py-1.5 text-sm font-semibold leading-6 text-slate-900 hover:bg-[#51A6DB]"
              style={{
                borderBottom: '4px solid #020202',
                borderLeft: '4px solid #020202',
                borderTop: '1px solid #020202',
                borderRight: '1px solid #020202',
              }}>
              Register
            </button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm font-bold text-gray-500">
          Already member? <Link href={'/login'} className="font-bold leading-6 text-[#51A6DB] hover:text-sky-900">Login</Link>
        </p>
      </div>
    </div>
  );
}