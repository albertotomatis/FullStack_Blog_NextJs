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
    <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-[#51A6DB]">Forgot password?</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 px-2.5">Email</label>
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
            <button type="submit" className="flex w-full justify-center rounded-md bg-[#ffbc5f] px-3 py-1.5 text-sm font-semibold leading-6 text-slate-900 hover:bg-[#51A6DB]"
            style={{
              borderBottom: '4px solid #020202',
              borderLeft: '4px solid #020202',
              borderTop: '1px solid #020202',
              borderRight: '1px solid #020202',
            }}>
              Reset password
            </button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm font-bold text-gray-500">
          Torna al <Link href="/login" className="font-bold leading-6 text-[#51A6DB] hover:text-sky-900">Login</Link>
        </p>
      </div>
    </div>
  );
}
