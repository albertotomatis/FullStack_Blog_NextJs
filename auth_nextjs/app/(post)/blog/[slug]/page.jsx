'use client';
import Link from "next/link";
import { BiEdit } from "react-icons/bi";
import { useSession } from "next-auth/react";
import RemoveBtn from "@/app/components/Posts/RemoveBtn";
import { ImPacman } from "react-icons/im";
import htmlSanitizer from "@/utils/sanitizeHtml";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import { useState, useEffect } from 'react';

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
    console.error(error);
    throw error;
  }
};

const SinglePost = ({ params }) => {
  const { slug } = params;
  const [post, setPost] = useState(null);
  const { data: session } = useSession();
  const [favoritePosts, setFavoritePosts] = useState([]);

  const fetchPost = async () => {
    try {
      const { post: fetchedPost } = await getPostBySlug(slug); 
      console.log("Fetched Post:", fetchedPost);
      setPost(fetchedPost);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (session) {
      const userFavoritePosts = session.user?.postPreferiti || [];
      setFavoritePosts(userFavoritePosts);
    }
  }, [session]);

  const handleAddToFavorites = async (postId) => {
    try {
      const response = await fetch('http://localhost:3000/api/addFavoritePost', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session?.user?.id, postId }),
      });

      if (!response.ok) {
        console.error('Errore durante l\'aggiunta del post ai preferiti');
        return;
      }

      if (!favoritePosts.includes(postId)) {
        setFavoritePosts((prevFavoritePosts) => [...prevFavoritePosts, postId]);
      }
    } catch (error) {
      console.error('Errore durante l\'aggiunta del post ai preferiti', error);
    }
  };

  const formatItalianDate = (date) => {
    if (!date) {
      return "";
    }

    const isValidDate = !isNaN(new Date(date).getTime());

    if (!isValidDate) {
      return "";
    }

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('it-IT', options).format(new Date(date));
  }

  console.log("Post data:", post);

  if (!post) {
    return <p>Caricamento...</p>;
  }


  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8 pt-16">
        {post && (
          <article key={post._id} className="p-6 bg-white rounded-lg border border-[#e0e0e0]">
            <div className="flex justify-between items-center mb-5 text-gray-600">
              <span className="bg-[#F5E9C4] text-[#333333] text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded">
                <ImPacman size={14} className="mr-1" />
                {post.category}
              </span>
              {post && (
                <span className="text-sm">{formatItalianDate(post.createdAt)}</span>
              )}
            </div>
            <h2 className="mb-2 text-3xl font-bold">{post.title}</h2>
            <p className="my-5">
              <span dangerouslySetInnerHTML={{ __html: htmlSanitizer(post.content) }} />
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
              <span>{post.author.name}</span>
              <span>({post.author.role})</span>
              </div>
            {session ? (
              <button
                onClick={() => handleAddToFavorites(post._id)}
                className={`text-[#333333] font-medium pt-5 ${favoritePosts.includes(post._id) ? 'text-red-500' : ''}`}
              >
                {favoritePosts.includes(post._id) ? (
                  <HiHeart size={24} />
                ) : (
                  <HiOutlineHeart size={24} />
                )}
              </button>
            ) : null}
            </div>
            <div className="flex gap-3">
            {session ? (
              (session.user.role === "admin" || session.user.id === String(post.author._id)) ? (
                <Link href={`/editPost/${post._id}`} className="text-[#4285f4] font-medium hover:underline pt-5">
                  <BiEdit size={24} />
                </Link>
              ) : null
            ) : null}
              <RemoveBtn id={post._id} post={post} />
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
export default SinglePost;
