'use client';
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { validateFormData, validateEmail, handleInputChange } from "@/app/components/Auth/Validation";

export default function ForgotPassword() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    handleInputChange(e, formData, setFormData, errors, setErrors, validateEmail);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = formData.email;

    const newErrors = validateFormData(formData);
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    // Invia i dati al server
    const res = await fetch("/api/forgotpass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      // L'email di reset password è stata inviata con successo
      router.push("/reset-password-sent");
    }
  };

  return (
    <section className="bg-gray-50 h-screen flex items-center justify-center">
      <div className="w-full p-6 bg-white rounded-lg shadow-md:mt-0 sm:max-w-md sm:p-20 shadow-lg">
        <h2 className="mb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
          Password dimenticata
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#" method="POST">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 px-2.5">
              Email
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="email"
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6"
              />
              {errors.email && (
                <p className="text-red-400 font-bold w-fit text-sm py-1 px-3 rounded-md mt-2">
                  {errors.email}
                </p>
              )}
            </div>
          </div>
          <div>
          <button
              type="submit"
              className="btn flex w-full justify-center px-3 py-1.5 rounded-lg text-sm font-semibold leading-6 text-slate-900">
              Invia
            </button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm font-bold text-gray-500">
          Torna al {" "}
          <Link href={'/login'} className="font-bold leading-6 text-[#51A6DB] hover:text-sky-900">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
