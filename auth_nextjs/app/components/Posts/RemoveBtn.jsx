'use client';
import { HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function RemoveBtn({ id, post }) {
  const router = useRouter();

  const removeTopic = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      const res = await fetch(`http://localhost:3000/api/listaPost?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push('/blog'); 
      }
    }
  }

  const { data: session } = useSession();
 
  return (
    session && (session.user.role === "admin" || session.user.id === post.author) ? (
      <button onClick={removeTopic} className="text-red-400 pt-5">
        <HiOutlineTrash size={24} />
      </button>
    ) : null
  );
}
