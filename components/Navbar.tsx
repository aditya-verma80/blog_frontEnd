import { RootState } from "@/redux/store";
import Link from "next/link";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { isAuthenticated, user, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  console.log(isAuthenticated, user, error, "navbar data --------------");
  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-3 text-xl">Blog Application</span>
        </a>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link href="/blog/create" className="mr-5 hover:text-gray-900">
            Add Blog
          </Link>
        </nav>
        <button className="text-white inline-flex items-center bg-red-800 border-0 py-1 px-3 focus:outline-none hover:bg-red-600 rounded text-base mt-4 md:mt-0 cursor-pointer">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
