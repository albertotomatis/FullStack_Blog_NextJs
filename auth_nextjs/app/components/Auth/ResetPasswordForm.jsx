'use client'
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from "next/navigation";
import { validateFormData, validateEmail, handleInputChange } from "@/app/components/Auth/Validation";

export function ResetPasswordForm() {

  const router = useRouter()

  // prende il token dall'URL
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [tokenExpired, setTokenExpired] = useState(false);

  const handleChange = (e) => {
    handleInputChange(e, formData, setFormData, errors, setErrors, validateEmail);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const password = formData.password;

    const newErrors = validateFormData(formData);
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    if (tokenExpired) {
      return;
    }

    // Verifica se il token è valido inviando una richiesta al server
    try {
      const resetRes = await fetch(`/api/resetpass/${token}`, {
        method: 'POST',
        body: JSON.stringify({ token, newPassword: password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (resetRes.ok) {
        router.push('/reset-password-success');
      } else {
        const response = await resetRes.json();
        if (response.error === 'TokenExpired') {
          setTokenExpired(true);
        } else {
          console.error('Errore durante il reset della password.');
        }
      }
    } catch (resetError) {
      console.error(resetError);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center w-full">
      <div className="bg-[#fdfdfd] rounded-lg shadow dark:border md:mt-0 sm:max-w-md md:px-8 md:py-8 xl:px-8 xl:py-8  ombra-bordo">
      {tokenExpired ? (
        <div className="text-center">
          <p>Il link per il reset della password è scaduto.</p>
          <p>Per favore, richiedi un nuovo link per il reset della password.</p>
        </div>
      ) : (
        <>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-[#51A6DB]">
              Inserisci la nuova password
            </h2>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 px-2.5">Nuova Password</label>
                <div className="mt-2">
                  <input
                    onChange={handleChange}
                    name="password"
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 sm:text-sm sm:leading-6"
                  />
                  {errors.password && (
                    <p className="text-red-400 font-bold w-fit text-sm py-1 px-3 rounded-md mt-2">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <button type="submit" className="btn flex w-full justify-center px-3 py-1.5 rounded-lg text-sm font-semibold leading-6 text-slate-900">
                  Invia
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
    </div>
  );
}

export default ResetPasswordForm;
