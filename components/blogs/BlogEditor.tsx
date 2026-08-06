"use client";

import { useRouter } from "next/navigation";
import BlogForm from "./BlogForm";
export default function BlogEditor() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-gray-800">BlogHub</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl"
          >
            Back to Dashboard
          </button>
        </nav>
      </header>

      {/* Main Content Form*/}
      <BlogForm />
    </div>
  );
}
