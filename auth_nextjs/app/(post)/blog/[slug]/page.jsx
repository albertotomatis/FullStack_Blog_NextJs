import Link from "next/link";
import { BiEdit } from "react-icons/bi";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import RemoveBtn from "@/app/components/Posts/RemoveBtn";
import { ImPacman } from "react-icons/im";
import htmlSanitizer from "@/utils/sanitizeHtml";

const getPostBySlug = async (slug) => {
  try {
    const res = await fetch(`http://localhost:3000/api/listaPost/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch post: HTTP status ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.log(error);
    throw error; // Rilancia l'errore per gestirlo meglio nell'app
  }
};


export default async function SinglePost({ params }) {
  const { slug } = params;
  const { post } = await getPostBySlug(slug);
  const session = await getServerSession(authOptions);
  {/* Formattazione della data (ad esempio: 6 novembre 2023 */}
  const formatItalianDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('it-IT', options).format(new Date(date));
  }

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8 pt-16">
      <article key={post._id} className="p-6 bg-white rounded-lg border border-[#e0e0e0]">
            <div className="flex justify-between items-center mb-5 text-gray-600">
              <span className="bg-[#F5E9C4] text-[#333333] text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded">
              <ImPacman size={14} className="mr-1" />
                {post.category}
              </span>
              {/* data */}
              <span className="text-sm">{formatItalianDate(post.createdAt)}</span>
            </div>
            {/* title */}
            <h2 className="mb-2 text-3xl font-bold">{post.title}</h2>
            <p className="my-5">
              <span dangerouslySetInnerHTML={{ __html: htmlSanitizer(post.content) }} />
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="font-medium">CodeLab Team</span>
              </div>
            </div>
            <div className="flex gap-3">
              {session ? (
                (session.user.role === "admin" || session.user.id === post.author) ? (
                  <Link href={`/editPost/${post._id}`} 
                    className="text-[#4285f4] font-medium hover:underline pt-5">
                      <BiEdit size={24} />
                  </Link>
                ) : null
              ) : null}
              <RemoveBtn id={post._id} post={post} />
            </div>
      </article>
      </div>
    </div>
  );
}
