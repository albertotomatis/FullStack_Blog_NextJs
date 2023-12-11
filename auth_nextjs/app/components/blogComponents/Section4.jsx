import Image from 'next/image';
import Link from 'next/link';
import Author from './author';

export default function Section4() {
    return (
        <section>
            <div className="contenitore">
                <div className="md:px-20">
                    <div className="grid lg:grid-cols-2">
                        <div className="item">
                            <h1 className="font-bold text-4xl">Travel</h1>
                            <div className="flex flex-col gap-6 mt-10">
                                {PostCat()}
                                {PostCat()}
                                {PostCat()}
                            </div>
                        </div>
                        <div className="item">
                            <h1 className="font-bold text-4xl">Business</h1>
                            <div className="flex flex-col gap-6 mt-10">
                                {PostCat()}
                                {PostCat()}
                                {PostCat()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}

function PostCat() {
    return (
        <div className="flex gap-5">
            <div className="image flex flex-col justify-start">
                <Image src={"/images/surreal.png"} className="rounded" width={300} height={300} />
            </div>
            <div className="info flex text-left flex-col">
                <Link href={"/"} className='text-sky-600 hover:text-sky-800'>Intelligenza Artificiale</Link>
                <Link href={"/"} className='text-gray-600 hover:text-gray-800 pt-3'>06 Dicembre 2023</Link>
                <div className='title text-left pt-3'>
                    <Link href={"/"} className='text-gray-600 hover:text-gray-800  
                        text-xl font-bold mt-3'>
                        Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum
                    </Link>
                </div>
                <Author />
            </div>
        </div>
    )
}