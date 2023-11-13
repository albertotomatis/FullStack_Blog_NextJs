'use client';
import Link from "next/link";
import { BiEdit } from "react-icons/bi";
import RemoveBtn from "@/app/components/Posts/RemoveBtn";
import { ImPacman } from "react-icons/im";
import htmlSanitizer from "@/utils/sanitizeHtml";
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

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
  
        console.log("Fetched Data:", data);
  
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
  
  const formatItalianDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('it-IT', options).format(new Date(date));
  };

  const uniqueCategories = [...new Set(posts.map((post) => post.category))];

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
      {/* Elenco delle categorie */}
        <h3 className="mb-8 text-2xl lg:text-2xl font-semibold mt-12">{"{ Categorie }"}</h3>
        <ul className="flex space-x-5 font-light ">
          {uniqueCategories.map((category) => (
            <li key={category}>
              <Link href={`/blog/category/${category}`}
              className="bg-[#4285f4] text-[#ffffff] text-md lg:text-md font-semibold inline-flex items-center px-3.5 py-1.5 rounded">
                <ImPacman size={18} className="mr-2" /> {category}
              </Link>
            </li>
          ))}
        </ul>
      </div>
 
      {/* Posts */}
      <div className="grid gap-8 lg:grid-cols-2">
        {posts.map((post) => (
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
            <h2 className="mb-2 text-3xl font-bold">
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
       {/* Controlli di paginazione */}
       <div>
        <button onClick={() => paginate(currentPage - 1)}>Previous Page</button>
        <button onClick={() => paginate(currentPage + 1)}>Next Page</button>
      </div>
    </div>
    );
  }

