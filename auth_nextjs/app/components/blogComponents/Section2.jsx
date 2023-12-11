'use client';
import Image from 'next/image';
import Link from 'next/link';
import Author from './author';
import { useState, useEffect } from 'react';
import htmlSanitizer from "@/utils/sanitizeHtml";
import { ImPacman } from "react-icons/im";

const formatItalianDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('it-IT', options).format(new Date(date));
};

export default function Section2() {
    const [recentPosts, setRecentPosts] = useState([]);
  
    useEffect(() => {
      const fetchPosts = async () => {
        try {  
          // Recupera gli ultimi 3 post (escludendo l'ultimo già ottenuto)
          const responseRecent = await fetch('http://localhost:3000/api/postRecenti');
          const dataRecent = await responseRecent.json();
  
          // Verifica se i dati dei post sono recuperati correttamente
          console.log('Dati recenti:', dataRecent);
  
          if (dataRecent && dataRecent.recentPosts && Array.isArray(dataRecent.recentPosts)) {
            // Aggiorna lo stato degli ultimi 3 post
            setRecentPosts(dataRecent.recentPosts.slice(0, 3)); // Prendi solo i primi tre post
          } else {
            console.error('Dati recenti non validi:', { dataRecent });
          }
        } catch (error) {
          console.error('Errore nel recupero dei post:', error);
        }
      };
  
      fetchPosts();
    }, []);
  
    return (
      <section>
        <div className="md:px-20 mb-4">
          <h1 className="font-bold text-4xl text-center mb-10">Latest Posts</h1>
          {recentPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <Post key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }
  
  function Post({ post }) {
    return (
      <div className="image rounded-md overflow-hidden">
        <Image src={post.image} width={600} height={600} />
        <div className="info text-left p-4">
        <Link href={`/blog/category/${post.category}`} 
          className="bg-[#F5E9C4] text-[#333333] text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded mr-10">
          <ImPacman size={14} className="mr-1" />
          {post.category}
        </Link>
        {/* data */}
        <span className="text-sm">{formatItalianDate(post.createdAt)}</span>
          <div className='title text-left pt-6'>
            <Link href={`/blog/${post.slug}`} className='text-gray-600 hover:text-gray-800 text-3xl md:text-5xl font-bold mt-4'>
              {post.title}
            </Link>
          </div>
          <p className='mt-8 text-left mb-4'>
            {post.content.length > 600 ? (
              <>
                <span dangerouslySetInnerHTML={{ __html: htmlSanitizer(post.content.slice(0, 600)) }} />
                {post.content.length > 600 && '...'}
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
          <Author />
        </div>
      </div>
    );
  }
  