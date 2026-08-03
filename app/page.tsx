import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function page() {
  const token = (await cookies()).get("authToken")?.value;
  redirect(token ? "/dashboard" : "/share");
}
