import Image from "next/image";
import Link from "next/link";

export default function Author({ author }) {
    return (
        <div className="author flex py-5">
            <Image src={author.avatarUrl} width={55} height={55} className="rounded-full"></Image>
            <div className="flex flex-col justify-center px-4">
                {author && (
                    <Link href={"/"}
                        className="text-md font-bold text-gray-800">
                            {author.name}
                    </Link>
                )}
                {author && (
                    <span className="text-sm text-gray-500">{author.role}</span>
                )}
            </div>
        </div>
    );
}
