'use client';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import RemoveBtn from "@/app/components/Posts/RemoveBtn";
import htmlSanitizer from "@/utils/sanitizeHtml";
// react icons
import { BiEdit } from "react-icons/bi";
import { ImPacman } from "react-icons/im";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { HiOutlineHeart } from "react-icons/hi";
import { HiHeart } from "react-icons/hi";


export default function PostList() {
  const router = useRouter();
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [postsPerPage] = useState(4);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const fetchPosts = async (page) => {
      try {
        const response = await fetch(`http://localhost:3000/api/listaPost?page=${page}`);
        const data = await response.json();

        setPosts(data.posts);
        setPageCount(Math.ceil(data.totalPosts / postsPerPage));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
  
    fetchPosts(currentPage); 
  }, [currentPage, postsPerPage]); 
  
  const paginate = (pageNumber) => {
    const maxPage = Math.floor(posts.length / postsPerPage);
  
    if (pageNumber >= 0 && pageNumber <= maxPage) {
      setCurrentPage(pageNumber);
      router.push(`/blog?page=${pageNumber}`);
    }
  };

  const handleAddToFavorites = async (postId) => {
    try {
      const response = await fetch('http://localhost:3000/api/addFavoritePost', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.user.id, postId }),
      });
    } catch (error) {
      console.error('Errore durante l\'aggiunta del post ai preferiti', error);
    }
  };
  
  const formatItalianDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('it-IT', options).format(new Date(date));
  };

  
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
      {/* Posts */}
      <div className="grid gap-8 lg:grid-cols-2">
        {posts.map((post) => (
          <article key={post._id} className="p-6 bg-white rounded-lg border border-[#e0e0e0]">
            <div className="flex justify-between items-center mb-5 text-gray-600">
              <Link href={`/blog/category/${post.category}`} 
                className="bg-[#F5E9C4] text-[#333333] text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded">
                <ImPacman size={14} className="mr-1" />
                {post.category}
            </Link>
              {/* data */}
              <span className="text-sm">{formatItalianDate(post.createdAt)}</span>
            </div>
            {/* title */}
            <h2 className="mb-2 text-3xl font-bold block max-w-full overflow-hidden overflow-ellipsis">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="mb-5">
              {/* Sanificazione del contenuto */}
              {post.content.length > 200 ? (
                <>
                  {post.content.slice(0, 200)}...
                </>
              ) : (
                <span dangerouslySetInnerHTML={{ __html: htmlSanitizer(post.content) }} />
              )}
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
            {/* aggiungi ai preferiti */}
            {session ? (
              <button
                onClick={() => handleAddToFavorites(post._id)}
                className="text-[#333333] font-medium pt-5"
              >
              {session?.user?.postPreferiti && session.user.postPreferiti.includes(post._id) ? (
                <HiHeart size={24} />
              ) : (
                <HiOutlineHeart size={24} />
              )}
              </button>
            ) : null}
            <div className="flex gap-3">
            {session ? (
                (session.user.role === "admin" || session.user.id === post.author) ? (
                  <Link href={`/editPost/${post._id}`} className="text-[#4285f4] font-medium hover:underline pt-5">
                    <BiEdit size={24} />
                  </Link>
                ) : null
              ) : null}
              <RemoveBtn id={post._id} post={post} />
            </div>
          </article>
        ))}
      </div>
       {/* Controlli di paginazione */}
       <div className="mt-12 flex justify-center space-x-12 font-light ">
        <button className="btn text-md lg:text-md font-semibold inline-flex items-center px-3.5 py-1.5 rounded"  
          onClick={() => paginate(currentPage - 1)}>
          <span><HiOutlineArrowNarrowLeft size={24} className="mr-2" /></span> Previous  
        </button>
        <button className="btn text-md lg:text-md font-semibold inline-flex items-center px-3.5 py-1.5 rounded"  
          onClick={() => paginate(currentPage + 1)}>
          Next <span><HiOutlineArrowNarrowRight size={24} className="ml-2" /></span>
        </button>
      </div>
    </div>
    );
  }

