import RegisterForm from "@/app/components/Auth/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Register() {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session.user.role !== 'admin') {
      redirect('/dashboard'); // Reindirizza gli utenti non amministratori
    } 
  }

  return <RegisterForm />;
}
