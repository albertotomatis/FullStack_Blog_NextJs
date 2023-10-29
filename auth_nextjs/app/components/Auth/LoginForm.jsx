'use client';
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; 
import { handleInputChange } from "@/app/components/Auth/Validation";
import { isValidEmail } from "@/utils/validation";
import { useSession } from "next-auth/react";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const { data: session } = useSession();
  const router = useRouter();

   // Funzione per cancellare gli errori
  const clearErrors = () => {
    setErrors({});
  }

  // Validazioni mentre l'utente digita
  const handleChange = (e) => {
    clearErrors(); // Pulisci gli errori quando l'utente modifica i dati
    handleInputChange(e, formData, setFormData, errors, setErrors, isValidEmail);
  }

  // All'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    try {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res.error === "InvalidCredentials") {
        setErrors({ invalidCredentials: "Invalid Credentials" });
      } else if (res.error === "EmailNotVerified") {
        setErrors({ emailNotVerified: "Email not verified" });
      } else if (res.error) {
        setErrors({ message: "An error occurred" });
      } else {
        // Se non ci sono errori, reindirizza l'utente alla dashboard
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setErrors({ message: "An error occurred" });
    }
      
  };

  return (
    <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
        <h2 className="mt-5 text-center text-3xl font-bold leading-9 tracking-tighter text-[#51A6DB]">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 px-2.5">Email</label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                type="text"
                name="email"
                className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 font-bold w-fit text-sm py-1 px-3 rounded-md mt-2">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 px-2.5">Password</label>

              <div className="text-sm">
                <Link href={'/forgotPassword'} className="font-semibold text-[#51A6DB] hover:text-sky-900">
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                onChange={handleChange}
                type="password"
                name="password"
                className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6"
              />
            </div>
            {errors.password && (
              <p className="text-red-400 font-bold w-fit text-sm py-1 px-3 rounded-md mt-2">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#ffbc5f] px-3 py-1.5 text-sm font-semibold leading-6 text-slate-900 hover:bg-[#51A6DB]"
              style={{
                borderBottom: '4px solid #020202',
                borderLeft: '4px solid #020202',
                borderTop: '1px solid #020202',
                borderRight: '1px solid #020202',
              }}
            >
              Login
            </button>
          </div>
          {errors.invalidCredentials && (
  <div className="bg-red-400 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
    {errors.invalidCredentials}
  </div>
)}

{errors.emailNotVerified && (
  <div className="bg-red-400 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
    {errors.emailNotVerified}
  </div>
)}

{errors.message && (
  <div className="bg-red-400 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
    {errors.message}
  </div>
)}
        </form>
        <p className="mt-10 text-center text-sm font-bold text-gray-500">
          Not a member?{" "}
          <Link href={'/register'} className="font-bold leading-6 text-[#51A6DB] hover:text-sky-900">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
