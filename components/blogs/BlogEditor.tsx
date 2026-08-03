"use client";

import { useState } from "react";
// 1. Import dynamic from Next.js
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// 2. Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>, // Optional loading state
});

const toolbarOptions = [
  [{ header: "1" }, { header: "2" }, { font: [] }],
  [{ size: [] }],
  ["bold", "italic", "underline", "strike", "blockquote"],
  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
  ["link", "image", "video"],
  ["clean"],
];

const BlogEditor = ({ blogId }: { blogId?: string }) => {
  const [value, setValue] = useState("");

  return (
    <>
      <p>blog edit page {blogId}</p>
      <ReactQuill
        value={value}
        onChange={setValue}
        modules={{ toolbar: toolbarOptions }}
      />
    </>
  );
};

export default BlogEditor;
