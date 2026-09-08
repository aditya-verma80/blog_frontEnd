"use client";

import { fetchBlogById } from "@/redux/slices/blogSlice";
import { currentUser } from "@/redux/slices/authSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";

export default function BlogDetails({ blogId }: { blogId: string }) {
  console.log(blogId, "blog details ");
  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedBlog: blog,
    loading,
    error,
  } = useSelector((state: RootState) => state.blog);
  console.log(blog);
  const { user, checkAuth } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchBlogById(blogId));
  }, [blogId, dispatch]);

  useEffect(() => {
    if (!checkAuth) dispatch(currentUser());
  }, [checkAuth, dispatch]);

  if (loading)
    return (
      <main className="mx-auto max-w-4xl p-4 sm:p-8">
        <Loader />
      </main>
    );
  if (error)
    return (
      <main
        id="main-content"
        role="alert"
        className="mx-auto max-w-4xl p-4 text-red-800 sm:p-8"
      >
        {error}
      </main>
    );
  if (!blog)
    return (
      <main id="main-content" className="mx-auto max-w-4xl p-4 sm:p-8">
        Blog not found.
      </main>
    );

  return (
    <main
      id="main-content"
      className="container mx-auto max-w-4xl px-4 py-8 text-gray-900"
    >
      <article className="min-w-0 rounded-lg bg-white p-4 shadow-md sm:p-8">
        <h1 className="mb-4 text-3xl font-bold text-blue-800 sm:text-4xl">
          {blog.title}
        </h1>
        <div className="mb-6 whitespace-pre-wrap border-b border-gray-200 pb-6 text-gray-700">
          {blog.content.replace(/<[^>]*>/g, " ")}
        </div>
        <p className="text-sm">
          By {blog.author?.username || blog.authorName || "Unknown"}
        </p>
        <p className="text-xs text-gray-500">
          Created: {new Date(blog.createdAt).toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">
          Updated: {new Date(blog.updatedAt).toLocaleString()}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center rounded bg-gray-700 px-4 py-2 text-white"
          >
            Back
          </Link>
          {(user?.id === blog.author?._id || user?.role === "admin") && (
            <Link
              href={`/blog/${blog._id}/edit`}
              className="inline-flex min-h-11 items-center rounded bg-amber-700 px-4 py-2 text-white"
            >
              Edit
            </Link>
          )}
        </div>
      </article>
    </main>
  );
}
