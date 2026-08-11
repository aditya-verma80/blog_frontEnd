"use client";

import ConfirmationModal from "@/components/ConfirmationModal";
import Navbar from "@/components/Navbar";
import { deleteBlog, fetchBlogs } from "@/redux/slices/blogSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { Blog } from "@/types/blog";

function safeFileName(title: string) {
  return title.replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "") || "blog";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character] as string);
}

function sanitizedContent(content: string) {
  const documentNode = new DOMParser().parseFromString(content, "text/html");
  documentNode.querySelectorAll("script, style, iframe, object, embed").forEach((node) => node.remove());
  documentNode.querySelectorAll("*").forEach((element) => {
    for (const attribute of Array.from(element.attributes)) {
      if (attribute.name.startsWith("on") || /javascript:/i.test(attribute.value)) {
        element.removeAttribute(attribute.name);
      }
    }
  });
  return documentNode.body.innerHTML;
}

function exportDocument(blog: Blog) {
  const html = `<!doctype html><html><body><h1>${escapeHtml(blog.title)}</h1><p>By ${escapeHtml(blog.authorName)}</p>${sanitizedContent(blog.content)}</body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "application/msword" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${safeFileName(blog.title)}.doc`;
  link.click();
  URL.revokeObjectURL(url);
}

function exportPdf(blog: Blog) {
  const popup = window.open("", "_blank");
  if (!popup) {
    toast.error("Allow pop-ups to export this blog as PDF");
    return;
  }
  popup.opener = null;
  popup.document.write(`<!doctype html><html><head><title>${escapeHtml(blog.title)}</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;line-height:1.6}small{color:#555}@media print{body{margin:20px}}</style></head><body><h1>${escapeHtml(blog.title)}</h1><small>By ${escapeHtml(blog.authorName)} · Created ${new Date(blog.createdAt).toLocaleString()} · Last edited ${new Date(blog.updatedAt).toLocaleString()}</small><hr/>${sanitizedContent(blog.content)}</body></html>`);
  popup.document.close();
  popup.focus();
  popup.print();
}

export default function Dashboard() {
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
    <section className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main id="main-content" className="container mx-auto px-4 py-8 sm:py-10">
        <div className="mb-8 flex flex-col items-start gap-4 min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link href="/blog/create" className="inline-flex min-h-11 items-center rounded bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">
            Add Blog
          </Link>
        </div>

        {loading && blogs.length === 0 && <p role="status">Loading blogs...</p>}
        {error && <p role="alert" className="mb-6 rounded bg-red-100 p-4 text-red-800">{error}</p>}
        {!loading && !error && blogs.length === 0 && <p>No blogs found.</p>}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article key={blog._id} className="min-w-0 flex flex-col rounded-lg bg-white p-4 shadow-lg sm:p-6">
              <h2 className="mb-3 text-xl font-bold">{blog.title}</h2>
              <p className="mb-6 line-clamp-4 grow text-gray-700">
                {blog.content.replace(/<[^>]*>/g, " ")}
              </p>
              <p className="text-sm text-gray-700">By {blog.author?.username || blog.authorName}</p>
              <p className="mb-5 text-xs text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p className="mb-5 text-xs text-gray-500">
                Last edited: {new Date(blog.updatedAt).toLocaleString()}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href={`/blog/${blog._id}`} className="inline-flex min-h-11 items-center rounded bg-blue-700 px-3 py-2 text-sm text-white">Read More</Link>
                {(user?.id === blog.author?._id || user?.role === "admin") && (
                  <Link href={`/blog/${blog._id}/edit`} className="inline-flex min-h-11 items-center rounded bg-amber-700 px-3 py-2 text-sm text-white">Edit</Link>
                )}
                {(user?.id === blog.author?._id || user?.role === "admin") && (
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ id: blog._id, title: blog.title })}
                    className="min-h-11 rounded bg-red-700 px-3 py-2 text-sm text-white"
                  >
                    Delete
                  </button>
                )}
                <button type="button" onClick={() => exportDocument(blog)} className="min-h-11 rounded bg-emerald-700 px-3 py-2 text-sm text-white" aria-label={`Download ${blog.title} as a Word document`}>DOC</button>
                <button type="button" onClick={() => exportPdf(blog)} className="min-h-11 rounded bg-violet-700 px-3 py-2 text-sm text-white" aria-label={`Print or save ${blog.title} as PDF`}>PDF</button>
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
    </section>
  );
}
