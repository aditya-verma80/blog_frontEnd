import BlogEditor from "@/components/blogs/BlogEditor";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.API_BASE_URL || "http://localhost:5000/api";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = (await cookies()).get("authToken")?.value;
  if (!token) redirect("/login");

  const headers = { Authorization: `Bearer ${token}` };
  const [authResponse, blogResponse] = await Promise.all([
    fetch(`${API_URL}/auth/me`, { headers, cache: "no-store" }),
    fetch(`${API_URL}/blogs/${encodeURIComponent(id)}`, { headers, cache: "no-store" }),
  ]);

  if (!authResponse.ok) redirect("/login");
  if (!blogResponse.ok) redirect("/blog");

  const authData = await authResponse.json();
  const blogData = await blogResponse.json();
  const isOwner = authData.user?.id === blogData.data?.author?._id;
  const isAdmin = authData.user?.role === "admin";
  if (!isOwner && !isAdmin) {
    redirect(`/blog/${id}`);
  }

  return <BlogEditor blogId={id} />;
}
