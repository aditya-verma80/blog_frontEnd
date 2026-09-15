import BlogDetails from "@/components/blogs/BlogDetails";

const BlogPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  console.log(id, "coming from blog page ---");
  return <BlogDetails blogId={id} />;
};

export default BlogPage;
