import Link from "next/link";
import { BiEdit } from "react-icons/bi";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import RemoveBtn from "@/app/components/Posts/RemoveBtn";

const getPosts = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/listaPost", {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }
    return res.json();
  } catch (error) {
    console.log("Error loading posts: ", error);
  }
};

{/* Formattazione della data (ad esempio: 6 novembre 2023 */}
const formatItalianDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('it-IT', options).format(new Date(date));
}

export default async function PostList() {
  const { posts } = await getPosts();
  const session = await getServerSession(authOptions);
  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8 pt-16">
        <h2 className="mb-4 text-4xl lg:text-5xl font-extrabold">Blog</h2>
        <p className="font-light text-xl sm:text-2xl">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        </p>
        <p className="font-light text-xl sm:text-2xl">
          Debitis porro non rem repellat aspernatur molestiae.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        {posts.map((post) => (
          <article key={post._id} className="p-6 bg-white rounded-lg border border-[#e0e0e0]">
            <div className="flex justify-between items-center mb-5 text-gray-600">
              <span className="bg-[#F5E9C4] text-[#333333] text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                <svg className="mr-1 w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                </svg>
                Tutorial
              </span>
              {/* data creazione post */}
              <span className="text-sm">{formatItalianDate(post.createdAt)}</span>
            </div>
            <h2 className="mb-2 text-3xl font-bold">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="mb-5">
             {/* se la lunghezza del contenuto del post supera i 200 
             utilizza slice(0, 200) per ottenere i primi 200 caratteri e aggiunge "..." alla fine.
             Se il contenuto è più breve di 200 caratteri, viene mostrato senza "..." 
            */} 
              {post.content.length > 200 ? `${post.content.slice(0, 200)}...` : post.content}
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="font-medium">CodeLab Team</span>
              </div>
              <Link href={`/blog/${post.slug}`} className="inline-flex items-center font-medium hover:underline">
                Leggi di più
                <svg className="ml-2 w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </Link>
            </div>
            <div className="flex gap-3">
              {session ? (
                session.user.role === "admin" ||
                (session.user.role === "author" && session.user.id === post.id) ? (
                  <Link href={`/editPost/${post._id}`} className="text-[#4285f4] font-medium hover:underline pt-5">
                    <BiEdit size={24} />
                  </Link>
                ) : null
              ) : null}
              <RemoveBtn id={post._id} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
