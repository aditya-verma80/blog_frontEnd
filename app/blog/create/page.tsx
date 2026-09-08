import BlogEditor from "@/components/blogs/BlogEditor";
import React from "react";

const CreateBlog = () => {
  return (
    <div>
      <h1>Add Blog</h1>
      <BlogEditor blogId={undefined} />
    </div>
  );
};

export default CreateBlog;
