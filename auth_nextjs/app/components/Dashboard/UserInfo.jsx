'use client';
import { useSession } from "next-auth/react";

export default function UserInfo() {

    const { data:session } = useSession();

    return ( <div className="flex flex-col justify-center px-6 py-14 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">User info</h1>
    </div>
    <div className="sm:mx-auto sm:w-full sm:max-w-sm py-5">
        <div>Name: <span className="font-bold">{session?.user?.name}</span></div>
    </div>
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div>Email: <span className="font-bold">{session?.user?.email}</span></div>
    </div>
    <div className="sm:mx-auto sm:w-full sm:max-w-sm py-5">
        <div>Role: <span className="font-bold">{session?.user?.role}</span></div>
    </div>
  </div>
    )
}