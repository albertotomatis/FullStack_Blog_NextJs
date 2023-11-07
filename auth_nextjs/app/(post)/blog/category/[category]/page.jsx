
const getCategory = async (category) => {
    try {
        const res = await fetch(`http://localhost:3000/api/postByCategory/${category}`, {
            cache: 'no-store',
        });
        if (!res.ok) {
            throw new Error('Failed to fetch posts');
        }
        return res.json();
    } catch (error) {
        console.log('Error loading posts: ', error);
    }
};

export default async function CategoryPage({ params }) {
    const { category } = params;
    const data = await getCategory(category);

    if (!data || !data.posts || data.posts.length === 0) {
        return (
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8 pt-16">
                    <h1>Non ci sono post in questa categoria</h1>
                </div>
            </div>
        );
    }

    const { posts } = data;

    return (
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8 pt-16">
        <h2 className="mb-4 text-4xl lg:text-5xl font-extrabold">Blog</h2>
            <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
            <h3 className="mb-8 text-2xl lg:text-2xl font-semibold mt-12">
                Categoria:
                <span className="text-category text-[#4285f4]">{" {"} {category} {"}"}</span>
            </h3>
            <ul>
                {posts.map((post) => (
                    <li key={post._id}>
                        titolo: {post.title}
                    </li>
                ))}
            </ul>
        </div>
        </div>
        </div>
    );
}

