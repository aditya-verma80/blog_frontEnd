"use client";

import Navbar from "@/components/Navbar";
import ConfirmationModal from "@/components/ConfirmationModal";
import { deleteBlog, fetchBlogs } from "@/redux/slices/blogSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function BlogPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading, error } = useSelector((state: RootState) => state.blog);
  const { user } = useSelector((state: RootState) => state.auth);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const result = await dispatch(deleteBlog(deleteTarget.id)).unwrap();
      toast.success(result.message);
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Unable to delete blog");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main id="main-content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-8 flex flex-col items-start gap-4 min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between">
          <h1 className="text-3xl font-bold">Blogs</h1>
          <Link href="/blog/create" className="inline-flex min-h-11 items-center rounded bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800">
            Add Blog
          </Link>
        </div>

        {loading && <p role="status">Loading blogs...</p>}
        {error && <p role="alert" className="rounded bg-red-100 p-4 text-red-800">{error}</p>}
        {!loading && !error && blogs.length === 0 && <p>No blogs found.</p>}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article key={blog._id} className="min-w-0 flex flex-col rounded-lg bg-white p-4 shadow sm:p-6">
              <h2 className="mb-3 text-xl font-bold">{blog.title}</h2>
              <p className="mb-5 line-clamp-4 grow text-gray-700">
                {blog.content.replace(/<[^>]*>/g, " ")}
              </p>
              <p className="mb-4 text-sm text-gray-500">
                By {blog.author?.username || blog.authorName || "Unknown"}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={`/blog/${blog._id}`} className="inline-flex min-h-11 items-center rounded bg-blue-700 px-3 py-2 text-sm text-white">
                  Read More
                </Link>
                {(user?.id === blog.author?._id || user?.role === "admin") && (
                  <Link href={`/blog/${blog._id}/edit`} className="inline-flex min-h-11 items-center rounded bg-amber-700 px-3 py-2 text-sm text-white">
                    Edit
                  </Link>
                )}
                {(user?.id === blog.author?._id || user?.role === "admin") && (
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id: blog._id, title: blog.title })}
                    className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
      <ConfirmationModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.title || "blog"}
      />
    </div>
  );
}
