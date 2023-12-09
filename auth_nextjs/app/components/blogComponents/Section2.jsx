import Image from 'next/image';
import Link from 'next/link';
import Author from './author';

export default function Section2() {
    return (
        <section>
                <div className="md:px-20 mb-4">
                    <h1 className="font-bold text-4xl text-center">Latest Posts</h1>
                </div>

            <div className="contenitore">
            <div className="md:px-20 grid md:grid-cols-2 lg:grid-cols-3 gap-14">
                    {Post()}
                    {Post()}
                    {Post()}
                </div>
            </div>
        </section>
    );
}

function Post() {
    return (
        <div className="item ">
            <div className="images rounded-md overflow-hidden">
                <Image src={"/images/surreal.png"} width={420} height={420} />
            </div>
            <div className="info text-left flex justify-center flex-col py-4">
                <Link href={"/"} className='text-sky-600 hover:text-sky-800'>Intelligenza Artificiale</Link>
                <Link href={"/"} className='text-gray-600 hover:text-gray-800 pt-3'>06 Dicembre 2023</Link>
                <div className='title text-left pt-3'>
                    <Link href={"/"} className='text-gray-600 hover:text-gray-800  
                        text-1xl md:text-4xl font-bold mt-3'>
                        Lorem Ipsum
                    </Link>
                </div>
                <p className='mt-7 text-left mb-5'> 
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                    when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                    It has survived not only five centuries but also the leap into electronic typesetting, 
                    remaining essentially unchanged. 
                </p>
                <Author />
            </div>
        </div>
    );
}
