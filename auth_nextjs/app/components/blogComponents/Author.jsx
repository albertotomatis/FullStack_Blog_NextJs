import Image from "next/image"
import Link from "next/link"

export default function Author() {
    return (
        <div className="author flex py-5">
            <Image src={"/images/authors/author1.png"} width={60} height={60} className="rounded-full"></Image>
            <div className="flex flex-col justify-center px-4">
                <Link href={"/"} className="text-md font-bold text-gray-800 ">
                Alberto
                </Link>
                <span className="text-sm text-gray-500">CEO and Founder</span>
            </div>
        </div>
    )
}
