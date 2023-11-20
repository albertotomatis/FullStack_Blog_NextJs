export default function EmailVerification() {
  return (
    <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
          Ci siamo quasi...
        </h1>
        <h2 className="mt-4 text-center text-xl font-bold leading-9 tracking-tight text-gray-900">
          Abbiamo inviato un link di verifica alla tua casella di posta. <br />
          Controlla la tua email e conferma la registrazione cliccando sul link fornito.
        </h2>
      </div>
    </div>
  );
}
