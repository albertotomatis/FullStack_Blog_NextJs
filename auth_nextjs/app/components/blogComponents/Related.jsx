import Image from 'next/image';
import Link from 'next/link';
import Author from '@/app/components/blogComponents/Author';

export default function RelatedPost() {
    return (
       <section>
            <div className="md:px-20 mb-4 mt-4">
                <h1 className="font-bold text-4xl text-center">Related</h1>  
            </div>
            <div className="flex flex-col gap-10">
                {PostRel()}
                {PostRel()}
            </div>
       </section>
    )
}

function PostRel() {
    return(
        <div className="flex gap-5 md:px-20 mt-6">
            <div className="image justify-start">
                <Image src={"/images/surreal.png"} className="rounded" width={800} height={800} />
            </div>   
            <div className="info text-left">
                <Link href={"/"} className='text-sky-600 hover:text-sky-800 pr-10'>Intelligenza Artificiale</Link>
                <Link href={"/"} className='text-gray-600 hover:text-gray-800 pt-3'>06 Dicembre 2023</Link>
                <div className='title text-left pt-3'>
                    <Link href={"/"} className='text-gray-600 hover:text-gray-800  
                        text-1xl md:text-3xl font-bold mt-3'>
                        Lorem Ipsum
                    </Link>
                </div>
                <p className='mt-4 text-left mb-5'> 
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                    when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                    It has survived not only five centuries but also the leap into electronic typesetting, 
                    remaining essentially unchanged. 
                </p>
                <Author />
            </div>
        </div>

        
    )
}