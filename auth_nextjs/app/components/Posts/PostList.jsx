import Link from "next/link";

const getPosts = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/listaPost", {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }
    return res.json();
  } catch (error) {
    console.log("Error loading posts: ", error);
  }
};

export default async function PostList() {
  const { posts } = await getPosts();
  return (
<div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
  <div class="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8 pt-16">
    <h2 class="mb-4 text-4xl lg:text-5xl font-extrabold ">Blog</h2>
    <p class="font-light  text-xl sm:text-2xl">
      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
    </p>
    <p class="font-light  text-xl sm:text-2xl">
      Debitis porro non rem repellat aspernatur molestiae.
    </p>
  </div> 
  <div class="grid gap-8 lg:grid-cols-2">
    {posts.map((post) => (
      <article key={post._id} class="p-6 bg-white rounded-lg border border-[#e0e0e0]">
        <div class="flex justify-between items-center mb-5 text-gray-600">
          <span class="bg-[#F5E9C4] text-[#333333] text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
            <svg class="mr-1 w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
            </svg>
            Tutorial
          </span>
          <span class="text-sm">14 days ago</span>
        </div>
        <h2 class="mb-2 text-3xl font-bold">
          <Link href={`/blog/${post.slug}`} >{post.title}</Link>
        </h2>
        <p class="mb-5 ">
          {post.content}
        </p>
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <span class="font-medium">Jese Leos</span>
          </div>
          <Link href={`/blog/${post.slug}`} class="inline-flex items-center font-medium hover:underline">
            Leggi di più
            <svg class="ml-2 w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </Link>
        </div>
      </article> 
    ))}
  </div>  
</div>

  );
}
