import EditPostForm from "@/app/components/Posts/EditPostForm";

const getPostById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/modificaPost/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch post: HTTP status ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.log(error);
    throw error; 
  }
};

export default async function EditPost({ params }) {
  const { id } = params;
  const { post } = await getPostById(id);
  const { title, content } = post;

  return (
    <EditPostForm id={id} title={title} content={content} post={post} />
  );
}
