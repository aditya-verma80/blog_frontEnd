"use client";

import { currentUser, logoutUser } from "@/redux/slices/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import LoaderButton from "./LoaderButton";

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { checkAuth, loading, user } = useSelector(
    (state: RootState) => state.auth,
  );

  console.log(user, "user details from nevbar page side");
  const { checkAuth, loading, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!checkAuth) dispatch(currentUser());
  }, [checkAuth, dispatch]);

  const handleLogout = async () => {
    try {
      const message = await dispatch(logoutUser()).unwrap();
      toast.success(message);
      router.replace("/login");
      router.refresh();
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Unable to log out");
    }
  };
  return (
    <header className="border-b border-gray-200 bg-white text-gray-700">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-4 sm:px-5 md:flex-row">
        <Link
          href="/dashboard"
          className="flex items-center font-medium text-gray-900 md:mr-auto"
          aria-label="Blog Application dashboard"
        >
    <header className="border-b border-gray-200 bg-white text-gray-700">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-4 sm:px-5 md:flex-row">
        <Link href="/dashboard" className="flex items-center font-medium text-gray-900 md:mr-auto" aria-label="Blog Application dashboard">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
            aria-hidden="true"
            aria-hidden="true"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">Blog Application</span>
        </Link>
        <nav
          aria-label="Account"
          className="flex min-w-0 flex-wrap items-center justify-center text-base"
        >
          <div className="text-center md:mr-5 md:text-right">
            <div className="text-sm text-gray-800 capitalize">
              Welcome! {user?.username || "User"}
            </div>
        </Link>
        <nav aria-label="Account" className="flex min-w-0 flex-wrap items-center justify-center text-base">
          {/* <Link href="/blog/create" className="mr-5 hover:text-gray-900">
            Add Blog
          </Link> */}
          <div className="text-center md:mr-5 md:text-right">
            <div className="text-sm text-gray-800">Welcome! {user?.username || "User"}</div>
            <div className="text-xs font-normal">
              {user?.role === "admin" ? "Administrator" : "User"}
              {user?.role === "admin" ? "Administrator" : "User"}
            </div>
          </div>
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="cursor-pointer inline-flex min-h-11 items-center rounded bg-red-800 px-4 py-2 text-base font-medium text-white hover:bg-red-900 disabled:cursor-not-allowed disabled:bg-gray-600"
          className="inline-flex min-h-11 items-center rounded bg-red-800 px-4 py-2 text-base font-medium text-white hover:bg-red-900 disabled:cursor-not-allowed disabled:bg-gray-600"
        >
          {loading ? <LoaderButton textval="Loading..." /> : "Logout"}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
