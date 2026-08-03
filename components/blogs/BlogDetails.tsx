import React from "react";

interface blogType {
  blogId: string;
}

const BlogDetails = ({ blogId }: blogType) => {
  return <>this the page view all detailes{blogId}</>;
};

export default BlogDetails;
