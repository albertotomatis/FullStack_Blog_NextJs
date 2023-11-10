'use client';
import { ResetPasswordForm } from '../../components/Auth/ResetPasswordForm';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const router = useRouter();
  const { data: session } = getSession();

  if (!session) {
    router.push('/');
    return null; // Interrompe il rendering della pagina
  }
  return <ResetPasswordForm />;
}
