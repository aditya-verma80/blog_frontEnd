import BlogEditor from "@/components/blogs/BlogEditor";

const EditBlogPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  // const { blogs } = useSelector((state: RootState) => state.blog);
  return (
    <>
      <div className="">
        <p>edit id no is {id}</p>
      </div>
      <BlogEditor blogId={id} />
    </>
  );
};

export default EditBlogPage;
