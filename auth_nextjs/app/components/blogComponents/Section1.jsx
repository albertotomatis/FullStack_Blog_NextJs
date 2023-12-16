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

export default function Section1() {
  const [latestPost, setLatestPost] = useState(null);

  useEffect(() => {
    const fetchLatestPost = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/latestPost/');
        const data = await response.json();
        setLatestPost(data.latestPost);
      } catch (error) {
        console.error('Errore nel recupero dell\'ultimo post:', error);
      }
    };

    fetchLatestPost();
  }, []); 

  return (
    <div className="contenitore">
      <div className="md:px-20">
        <h1 className="font-bold text-5xl pb-12">Trending</h1>  
        {latestPost && Slide(latestPost)}
      </div>
    </div>
  );
}

function Slide(post) {
  return (
    <div className="grid md:grid-cols-2">
      <div className="image rounded-md overflow-hidden"> 
        <Image src={post.imageUrl} width={600} height={600} />
      </div>
      <div className="info text-left">
        <Link href={`/blog/category/${post.category}`} 
          className="bg-[#F5E9C4] text-[#333333] text-sm font-medium inline-flex items-center px-2.5 py-0.5 rounded mr-10">
          <ImPacman size={14} className="mr-1" />
          {post.category}
        </Link>
        {/* data */}
        <span className="text-sm">{formatItalianDate(post.createdAt)}</span>
        <div className='title text-left pt-6'>
          <Link href={`/blog/${post.slug}`} className='text-gray-600 hover:text-gray-800 text-3xl md:text-6xl font-bold mt-4'>
            {post.title}
          </Link>
        </div>
        <p className='mt-8 text-left mb-4'>
          {/* Sanificazione del contenuto */}
          {post.content.length > 1100 ? (
            <>
              <span dangerouslySetInnerHTML={{ __html: htmlSanitizer(post.content.slice(0, 1100)) }} />
              {post.content.length > 1100 && '...'}
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
        <Author author={post.author} />
      </div>
    </div>
  );
}
