// "use client";
// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
// import {
//   createBlog,
//   updateBlog,
//   fetchBlogById,
// } from "@/lib/redux/slices/blogsSlice";
// import { Button } from "@/components/ui/button";
// const editorModules = {
//   toolbar: [
//     ["bold", "italic", "underline", "strike"],
//     ["blockquote", "code-block"],
//     [{ header: 1 }, { header: 2 }],
//     [{ list: "ordered" }, { list: "bullet" }],
//     ["link", "image"],
//     ["clean"],
//   ],
// };
// function QuillEditor({
//   value,
//   onChange,
// }: {
//   value: string;
//   onChange: (content: string) => void;
// }) {
//   const editorRef = useRef<HTMLDivElement | null>(null);
//   const quillRef = useRef<any>(null);
//   const onChangeRef = useRef(onChange);
//   useEffect(() => {
//     onChangeRef.current = onChange;
//   }, [onChange]);
//   useEffect(() => {
//     if (!editorRef.current || quillRef.current) return;
//     let isMounted = true;
//     import("quill").then(({ default: Quill }) => {
//       if (!isMounted || !editorRef.current || quillRef.current) return;
//       const quill = new Quill(editorRef.current, {
//         theme: "snow",
//         modules: editorModules,
//       });
//       quill.root.innerHTML = value;
//       quill.on("text-change", () => {
//         onChangeRef.current(quill.root.innerHTML);
//       });
//       quillRef.current = quill;
//     });
//     return () => {
//       isMounted = false;
//     };
//   }, [value]);
//   useEffect(() => {
//     const quill = quillRef.current;
//     if (!quill || quill.root.innerHTML === value) return;
//     const selection = quill.getSelection();
//     quill.root.innerHTML = value;
//     if (selection) {
//       quill.setSelection(selection);
//     }
//   }, [value]);
//   return <div ref={editorRef} className="min-h-64" />;
// }
// export default function BlogEditor({ blogId }: { blogId?: string }) {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const { isAuthenticated, initialized } = useAppSelector(
//     (state) => state.auth,
//   );
//   const { currentBlog, loading, error } = useAppSelector(
//     (state) => state.blogs,
//   );
//   const [mounted, setMounted] = useState(false);
//   const [localError, setLocalError] = useState("");
//   const [formData, setFormData] = useState({ title: "", content: "" });
//   useEffect(() => {
//     setMounted(true);
//   }, []);
//   useEffect(() => {
//     if (!initialized) {
//       return;
//     }
//     if (!isAuthenticated) {
//       router.push("/login");
//       return;
//     }
//     if (blogId) {
//       dispatch(fetchBlogById(blogId));
//     }
//   }, [blogId, initialized, isAuthenticated, router, dispatch]);
//   useEffect(() => {
//     if (currentBlog && blogId) {
//       setFormData({ title: currentBlog.title, content: currentBlog.content });
//     }
//   }, [currentBlog, blogId]);
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };
//   const handleEditorChange = (content: string) => {
//     setFormData((prev) => ({ ...prev, content }));
//   };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLocalError("");
//     if (!formData.title.trim() || !formData.content.trim()) {
//       setLocalError("Please fill in all fields");
//       return;
//     }
//     if (blogId) {
//       dispatch(updateBlog({ id: blogId, ...formData })).then((result) => {
//         if (result.type === updateBlog.fulfilled.type) {
//           router.push("/dashboard");
//         }
//       });
//     } else {
//       dispatch(createBlog(formData)).then((result) => {
//         if (result.type === createBlog.fulfilled.type) {
//           router.push("/dashboard");
//         }
//       });
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {" "}
//       {/* Header */}{" "}
//       <header className="bg-white shadow-sm sticky top-0 z-50">
//         {" "}
//         <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
//           {" "}
//           <h1 className="text-2xl font-bold text-gray-800">BlogHub</h1>{" "}
//           <Button
//             onClick={() => router.push("/dashboard")}
//             className="bg-gray-600 hover:bg-gray-700 text-white"
//           >
//             {" "}
//             Back to Dashboard{" "}
//           </Button>{" "}
//         </nav>{" "}
//       </header>{" "}
//       {/* Main Content */}{" "}
//       <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {" "}
//         <div className="bg-white rounded-lg shadow-md p-8">
//           {" "}
//           <h2 className="text-3xl font-bold text-gray-800 mb-6">
//             {" "}
//             {blogId ? "Edit Blog" : "Create New Blog"}{" "}
//           </h2>{" "}
//           {error && (
//             <div
//               className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg"
//               role="alert"
//             >
//               {" "}
//               {error}{" "}
//             </div>
//           )}{" "}
//           {localError && (
//             <div
//               className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg"
//               role="alert"
//             >
//               {" "}
//               {localError}{" "}
//             </div>
//           )}{" "}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {" "}
//             <div>
//               {" "}
//               <label
//                 htmlFor="title"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 {" "}
//                 Blog Title{" "}
//               </label>{" "}
//               <input
//                 id="title"
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter your blog title"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 aria-label="Blog title"
//               />{" "}
//             </div>{" "}
//             <div>
//               {" "}
//               <label
//                 htmlFor="content"
//                 className="block text-sm font-medium text-gray-700 mb-2"
//               >
//                 {" "}
//                 Blog Content{" "}
//               </label>{" "}
//               {mounted && (
//                 <QuillEditor
//                   value={formData.content}
//                   onChange={handleEditorChange}
//                 />
//               )}{" "}
//               {!mounted && (
//                 <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
//                   {" "}
//                   <p className="text-gray-600">Loading editor...</p>{" "}
//                 </div>
//               )}{" "}
//             </div>{" "}
//             <div className="flex gap-4 pt-6">
//               {" "}
//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg"
//               >
//                 {" "}
//                 {loading
//                   ? blogId
//                     ? "Updating..."
//                     : "Creating..."
//                   : blogId
//                     ? "Update Blog"
//                     : "Create Blog"}{" "}
//               </Button>{" "}
//               <Button
//                 type="button"
//                 onClick={() => router.push("/dashboard")}
//                 className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 rounded-lg"
//               >
//                 {" "}
//                 Cancel{" "}
//               </Button>{" "}
//             </div>{" "}
//           </form>{" "}
//         </div>{" "}
//       </main>{" "}
//     </div>
//   );
// }
