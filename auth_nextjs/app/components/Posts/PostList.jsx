'use client';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useSession } from "next-auth/react";
import Image from 'next/image';
import Author from '@/app/components/blogComponents/Author';
import RemoveBtn from "@/app/components/Posts/RemoveBtn";
import htmlSanitizer from "@/utils/sanitizeHtml";
import { BiEdit } from "react-icons/bi";
import { ImPacman } from "react-icons/im";
import { HiOutlineArrowNarrowRight, HiOutlineArrowNarrowLeft, HiOutlineHeart, HiHeart } from "react-icons/hi";
import ReactPaginate from 'react-paginate';

export default function PostList() {
  const router = useRouter();
  const { data: session } = useSession();
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 9;
  const [totalPages, setTotalPages] = useState(0);

  // Inizializza gli stati dei post preferiti solo se la sessione è attiva
  useEffect(() => {
    if (session) {
      const userFavoritePosts = session.user?.postPreferiti || [];
      setFavoritePosts(userFavoritePosts);
    }
  }, [session]);

  const handlePageClick = (selectedPage) => {
    console.log('Page clicked:', selectedPage.selected);
    setCurrentPage(selectedPage.selected);
  };

  useEffect(() => {
    const fetchPosts = async (page) => {
      console.log('Fetching posts for page:', page);

      try {
        const response = await fetch(`http://localhost:3000/api/listaPost?page=${page}`);
        const data = await response.json();

        console.log('Fetched posts:', data.posts);

        setPosts(data.posts);

        if (data.totalPosts && !isNaN(data.totalPosts) && data.totalPosts > 0) {
          const totalPages = Math.ceil(data.totalPosts / postsPerPage);
          setTotalPages(totalPages);
        } else {
          setTotalPages(Math.ceil(data.totalPosts / postsPerPage));
        }
      } catch (error) {
        console.error("Errore nel recupero dei post:", error);
      }
    };

    fetchPosts(currentPage);
  }, [currentPage]);

  const handleAddToFavorites = async (postId) => {
    try {
      const response = await fetch('http://localhost:3000/api/addFavoritePost', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session?.user?.id, postId }),
      });
      if (!favoritePosts.includes(postId)) {
        setFavoritePosts((prevFavoritePosts) => [...prevFavoritePosts, postId]);
      }
    } catch (error) {
      console.error('Errore durante l\'aggiunta del post ai preferiti', error);
    }
  };

  const formatItalianDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('it-IT', options).format(new Date(date));
  };

  return (
    <div className="md:px-80 mb-4 top">
          <h1 className="font-bold text-4xl text-center mb-10">Latest Posts</h1>
      {/* Posts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => {
          return (
            <article key={post._id} className="p-6 bg-white rounded-lg border border-[#e0e0e0]" >
                  <div className="image rounded-md overflow-hidden mb-6"> 
                  <Image src={post.imageUrl} width={600} height={600} />
                </div>
              <div className="flex justify-between items-center mb-5 text-gray-600">
                <Link href={`/blog/category/${post.category}`} className="bg-[#F5E9C4] text-[#333333] text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded">
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
                {post.content.length > 250 ? (
                  <>
                    <span dangerouslySetInnerHTML={{ __html: htmlSanitizer(post.content.slice(0, 250)) }} />
                    {post.content.length > 250 && '...'}
                  </>
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: htmlSanitizer(post.content) }} />
                )}
              </p>
              <Link href={`/blog/${post.slug}`} className="inline-flex items-center font-medium hover:underline mb-2">
                  Leggi di più
                  <svg className="ml-2 w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </Link>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                <Author author={post.author} />
                </div>
                {/* aggiungi ai preferiti */}
                {session && (
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
                  )}
              </div>
              
              {session && (
                <div className="flex items-center space-x-4">
                   {/* Modifica e Rimuovi solo se l'utente è autorizzato */}
                   <div className="flex items-center space-x-4">
                  {session.user.role === 'admin' || session.user.id === String(post.author._id) ? (
                    <>
                      {console.log("User is authorized")}
                      <Link href={`/editPost/${post._id}`} className="text-[#4285f4] font-medium hover:underline pt-5">
                        <BiEdit size={24} />
                      </Link>
                      <RemoveBtn id={post._id} post={post} />
                    </>
                  ) : null}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center space-x-12 font-light">
        {/* Paginazione */}
        <ReactPaginate
          previousLabel={
            <button className="btn text-md lg:text-md font-semibold inline-flex items-center px-3.5 py-1.5 rounded">
              <span><HiOutlineArrowNarrowLeft size={24} className="mr-2" /></span> Previous
            </button>
          }
          nextLabel={
            <button className="btn text-md lg:text-md font-semibold inline-flex items-center px-3.5 py-1.5 rounded">
              Next <span><HiOutlineArrowNarrowRight size={24} className="ml-2" /></span>
            </button>
          }
          breakLabel={'...'}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination flex justify-center mt-12 space-x-12 font-light'}
          activeClassName={'active'}
          pageClassName={'page'}
          previousClassName={'previous'}
          nextClassName={'next'}
        />
      </div>
</div>
  );
}