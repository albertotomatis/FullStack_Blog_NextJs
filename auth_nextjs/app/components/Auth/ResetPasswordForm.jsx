'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { isValidPassword } from "../../../utils/validation";
import Link from 'next/link';

const validateFormData = (formData) => {
  const errors = {};
  if (!formData.password) {
    errors.password = "La password è un campo obbligatorio";
  } else if (!isValidPassword(formData.password)) {
    errors.password = "La password non è valida. Assicurati che abbia almeno 8 caratteri, un carattere maiuscolo, un carattere minuscolo, un numero e un carattere speciale.";
  }
  return errors;
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [tokenExpired, setTokenExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Validazione della password in tempo reale
    const newErrors = validateFormData({ ...formData, [name]: value });
    setErrors(newErrors);
  
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const password = formData.password;

    const newErrors = validateFormData(formData);
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    try {
      const resetRes = await fetch(`/api/resetpass/${token}`, {
        method: 'POST',
        body: JSON.stringify({ token, newPassword: password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (resetRes.ok) {
        setFormData({ password: '' });
        router.push('/reset-password-success');
      } else {
        const response = await resetRes.json();

        // Utilizza il messaggio di errore fornito dal server
        if (response.message === 'TokenExpiredError') {
          setErrorMessage(
            <p className="text-red-400 text-center font-bold mb-4">
              Link per il reset  password scaduto.{" "}
              <Link href="/forgotPassword" className="text-red-400 underline">
                Richiedi un nuovo link
              </Link>
              .
            </p>
          );
          setTokenExpired(true);
        } else if (response.message === 'InvalidTokenError') {
          setErrorMessage(
            <>
              Link non valido. <br />
              Utilizza il link ricevuto per email.
            </>
          );
        } else {
          setErrorMessage(response.message);
        }
      }
    } catch (resetError) {
      // Gestione generica degli errori durante la richiesta
      setErrorMessage("Si è verificato un errore durante il reset della password.");
    }
  }

  return (
    <section className="bg-gray-50 h-screen flex items-center justify-center">
      <div className="w-full p-6 bg-white rounded-lg shadow-md:mt-0 sm:max-w-md sm:p-20 shadow-lg">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
            Nuova password
          </h2>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="text-red-400 text-center font-bold mb-4">
            {errorMessage}
          </div>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#" method="POST">
            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 px-2.5">Nuova Password</label>
              <div className="mt-2">
                <input
                  onChange={handleChange}
                  name="password"
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-1inset focus:ring-sky-900 sm:text-sm sm:leading-6"
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
      </div>
    </section>
  );
}
