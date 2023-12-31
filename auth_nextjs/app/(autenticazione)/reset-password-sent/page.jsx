
export default function ResetPasswordSent() {

  return (
    <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Email di reset password inviata
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <p className="text-center text-gray-700">
          Ti abbiamo inviato un'email con le istruzioni per il reset della password. 
          Controlla la tua casella di posta elettronica e segui le indicazioni fornite nell'email.
        </p>
      </div>
    </div>
  );
}

