import React from "react";

interface blogType {
  blogId: string;
}

const BlogDetails = ({ blogId }: blogType) => {
  return (
    <>
      this the page view all detailes{blogId}
      <main className="w-4xl mx-auto px-4 sm-px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">Blog Title</h1>

          <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed border-b border-gray-200 pb-4">
            Tailwind doesn`t include pre-designed button styles out of the box,
            but they`re easy to build using existing utilities. Here are a few
            examples
          </div>

          <span className="border-b border-gray-200 h-1"></span>

          <div className="flex justify-between items-center mb-6  py-4 ">
            <div className="">
              <p className="text-sm text-gray-800"> By author name</p>
              <p className="text-xs text-gray-500">create At: 24-08-2026</p>

              <p className="text-xs text-gray-500">Update At: 24-08-2026</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default BlogDetails;
