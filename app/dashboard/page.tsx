"use client";
// import Button from "@/components/Button";
import ConfirmationModal from "@/components/ConfirmationModal";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import {  useState } from "react";



const uesrData =  [
    {
      "id": 1,
      "title": "blog title first",
      "authName": "aditya",
      "content": "The JavaScript course for everyone! Master JavaScript with projects, challenges and theory.",
      "createAt": "2026-07-12",
      "updateAt": "2026-07-29"
    },
    {
      "id": 2,
      "title": "blog title first",
      "authName": "vivek",
      "content": "The JavaScript course for everyone! Master JavaScript with projects, challenges and theory.",
      "createAt": "2026-07-12",
      "updateAt": "2026-07-29"
    },
    {
      "id": 3,
      "title": "The Ultimate JavaScript Course",
      "authName": "tanuj",
      "content": "The JavaScript course for everyone! Master JavaScript with projects, challenges and theory.",
      "createAt": "2026-07-12",
      "updateAt": "2026-07-29"
    }
  ]

const Dashboard = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const handleDelete = () => {
    console.log("Item deleted successfully!");
  };



  console.log("User data:", uesrData);
  return (
    <section>
      <Navbar />

      {/* left side side bar */}
      {/* <div className="relative bg-white dark:bg-gray-800">
          <LeftSidebar />
        </div> */}

      {/* right side content */}
      {/* <div className="rightside p-6 bg-neutral-secondary text-medium text-body rounded-base w-full">
          <RightSidebar />
        </div> */}

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
        {uesrData &&
          uesrData.map((blog) => (
            <section
              key={blog.id}
              className="flex flex-col  antialiased  min-h-screen p-4"
            >
              <div className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="grow flex flex-col p-5">
                  <div className="grow">
                    <header className="mb-3">
                      <a
                        className="block focus:outline-none focus-visible:ring-2"
                        href="#0"
                      >
                        <h3 className="text-[22px] text-gray-900 font-extrabold leading-snug">
                          The Ultimate JavaScript Course
                        </h3>
                      </a>
                    </header>
                    <div className="mb-8">
                      <p>
                        The JavaScript course for everyone! Master JavaScript
                        with projects, challenges and theory.
                      </p>
                    </div>
                    <div className="">
                      <p className="text-gray-700">By {blog.authName}</p>
                      <p className="text-sm text-gray-800">{blog.createAt}</p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    {/* <Button buttonName="click me" bgColor="bg-red-400" clickRouter={blog.id}/> */}

                    <button
                      onClick={() => router.push(`/blog/${blog.id}`)}
                      className="font-medium text-sm inline-flex items-center justify-center px-3 py-1.5 rounded leading-5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                    >
                      Read More
                    </button>

                    <button
                      onClick={() => router.push(`/blog/${blog.id}/edit`)}
                      className=" font-semibold text-sm inline-flex items-center justify-center px-2 py-1 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-yellow-600 focus:outline-none focus-visible:ring-2 hover:bg-600-700 text-white cursor-pointer"
                    >
                      Edit
                    </button>
                    <a
                      onClick={() => setIsOpen(true)}
                      className="pointer-cursor font-semibold text-sm inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded leading-5 shadow-sm transition duration-150 ease-in-out bg-red-500 focus:outline-none focus-visible:ring-2 hover:red-indigo-600 text-white cursor-pointer"
                    >
                      Delete
                    </a>
                    <ConfirmationModal
                      isOpen={isOpen}
                      onClose={() => setIsOpen(false)}
                      onConfirm={handleDelete}
                      itemName={blog.id}
                    />
                  </div>
                </div>
              </div>
            </section>
          ))}
      </div>
    </section>
  );
};

export default Dashboard;
