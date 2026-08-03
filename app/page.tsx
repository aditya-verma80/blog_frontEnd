import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function page() {
  const token = (await cookies()).get("auth")?.value;
  redirect(token ? "/dashboard" : "/login");
}
