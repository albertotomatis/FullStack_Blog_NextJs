'use client';
import { useSession } from 'next-auth/react';
import CreatePostForm from "@/app/components/Posts/CreatePostForm";

export default function CreaPost() {

    const { data: session } = useSession();
    if (session) {
        const isAdmin = session.user?.role === 'admin';  
        const isAuthor = session.user?.role === 'author'; 
        if (isAdmin || isAuthor) {
            return (
                <CreatePostForm />
                )
        } else {
            return (
                <div className="flex flex-col justify-center px-6 py-14 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h1 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Devi essere un admin per creare post.
                        </h1>
                        </div>  
                    </div>
            );
        }
    }   
    return (
        <div className="flex flex-col justify-center px-6 py-14 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h1 className="mt-10 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Accesso non autorizzato.
                </h1>
                </div>  
            </div>
    ); 
}
