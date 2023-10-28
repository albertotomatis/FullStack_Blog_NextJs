'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; 
import { useRouter } from "next/navigation";

export function EmailVerification() {
    const router = useRouter();
    // prende il token dall'URL
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    // Verifica se il token è valido inviando una richiesta al server
    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const resetRes = await fetch(`/api/verificaemail/${token}`, {
                    method: 'POST',
                    body: JSON.stringify({ token }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (resetRes.ok) {
                    router.push('/email-verification-success');
                } else {
                    const response = await resetRes.json();
                }
            } catch (resetError) {
                console.error(resetError);
            }
        };

        verifyEmail();
    }, [token, router]);

    return (
        <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Email Verificata con successo
                </h2>
            </div>
        </div>
    );
}

export default EmailVerification;
