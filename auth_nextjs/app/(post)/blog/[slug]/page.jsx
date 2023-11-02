const getPostBySlug = async (slug) => {
  try {
    const res = await fetch(`http://localhost:3000/api/listaPost/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch post: HTTP status ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.log(error);
    throw error; // Rilancia l'errore per gestirlo meglio nell'app
  }
};

export default async function SinglePost({ params }) {
  const { slug } = params;
  const { post } = await getPostBySlug(slug);

  return (
    <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </div>
    </div>
  );
}
