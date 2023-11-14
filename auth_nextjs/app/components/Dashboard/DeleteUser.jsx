import { HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function RemoveUser({ id, user }) {
  const router = useRouter();

  const removeUser = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      try {
        const res = await fetch(`http://localhost:3000/api/listaUtenti?id=${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          router.push('/dashboard');
          window.location.reload();
        } else {
          console.error("Error deleting user:", res.status, res.statusText);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const { data: session } = useSession();

  return (
    session ? (
      session.user.role === "admin" ? (
        <button onClick={removeUser} className="text-red-400 pt-5">
          <HiOutlineTrash size={24} />
        </button>
      ) : null
    ) : null
  );
}
