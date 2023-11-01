const getPostById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/listaPost/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch post");
    }
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export default async function SinglePost({ params }) {
  const { id } = params;
  const { post } = await getPostById(id);

  return (
    <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h1>{post.title}</h1>
            <p>{post.content}</p>
      </div>
    </div>
  );
}