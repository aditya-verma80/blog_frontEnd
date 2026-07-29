import React from "react";

interface blogType {
  blogId: string;
}

const BlogDetails = ({ blogId }: blogType) => {
  return (
    <>
    
     This is main blog page {blogId}
    
    
    </>
  );
};

export default BlogDetails;
