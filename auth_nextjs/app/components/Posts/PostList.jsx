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
          <h2 class="mb-4 text-center text-3xl font-bold">
            Blog
          </h2>
      </div> 
      {posts.map((post) => (
        <div key={post._id}
          className="p-4 border border-slate-300 my-3 flex justify-between gap-5 items-start">
          <div>
            <h1 className="font-bold text-2xl">
            <Link href={`/blog/${post._id}`}>{post.title}</Link>
            </h1>
            <div>{post.content}</div>
            <div>id: {post._id}</div>
          </div>
        </div>
      ))}
      </div>
  );
}
