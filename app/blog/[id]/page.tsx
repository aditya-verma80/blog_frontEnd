import BlogDetails from "@/components/blogs/BlogDetails";

const BlogPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <BlogDetails blogId={id} />;
};

export default BlogPage;
