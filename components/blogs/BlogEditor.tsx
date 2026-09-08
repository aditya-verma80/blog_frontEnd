"use client";

import { useRouter } from "next/navigation";
import BlogForm from "./BlogForm";

export default function BlogEditor({ blogId }: { blogId: string }) {
  console.log(blogId, "coming from blog editor page");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav aria-label="Blog editor" className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6 lg:px-8">
          <span className="text-xl font-bold text-gray-800 sm:text-2xl">BlogHub</span>
          <button
            onClick={() => router.push("/dashboard")}
            className="min-h-11 rounded-xl bg-gray-700 px-3 py-2 text-sm text-white hover:bg-gray-800 sm:px-4 sm:text-base"
          >
            Back to Dashboard
          </button>
        </nav>
      </header>

      {/* Main Content Form*/}
      <BlogForm blogId={blogId} />
      <BlogForm blogId={blogId} />
    </div>
  );
}
