"use client";
import Link from "next/link";
import { useActionState } from "react";
import { z } from "zod";

type FormState = {
  success: boolean;
  message: string;
  errors?: {
    username?: string[];
    email?: string[];
  };
  inputs?: {
    username: string;
    email: string;
  };
} | null;

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be under 20 characters."),
  email: z.string().email("Please enter a valid email address."),
});

async function submitForm(prevState, formData) {
  const username = formData.get("username");
  const email = formData.get("email");
  const age = formData.get("age");
  const role = formData.get("role");
  const address = formData.get("address");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (!username || !email || !age || role) {
    return { success: false, message: "All fields are required." };
  }

  // Simulate API call
  await new Promise((res) => setTimeout(res, 1000));

  return { success: true, message: `Welcome, ${username}!` };
}

const RegisterFrom = () => {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    submitForm,
    {
      success: false,
      error: null,
      message: "",
    },
  );
  console.log(state, "value of the data form");
  return (
    <section className="max-w-full">
      <div className=" flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-10 bg-gray-900 ">
        <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 border">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-white md:text-2xl dark:text-white">
              Create your account
            </h1>
            <form className="space-y-4 md:space-y-6" action={formAction}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  placeholder="name@company.com"
                />
              </div>

              <div className="flex flex-wrap -m-2 mb-2 ">
                <div className="p-2 w-1/2">
                  <div className="relative">
                    <label
                      htmlFor="age"
                      className="leading-7 text-sm text-white "
                    >
                      Age
                    </label>
                    <input
                      type="text"
                      id="age"
                      name="age"
                      className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="p-2 w-1/2">
                  <div className="relative">
                    <label
                      htmlFor="role"
                      className="leading-7 text-sm text-white"
                    >
                      Role
                    </label>
                    <select
                      id="small"
                      name="role"
                      className="block w-full rounded-md bg-white/5 px-3 py-2.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
                    >
                      <option className="text-gray-800">
                        Choose Your Role
                      </option>
                      <option className="text-gray-800" defaultValue="user">
                        User
                      </option>
                      <option className="text-gray-800" defaultValue="admin">
                        Admin
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  placeholder="address"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Confirm Password
                </label>
                <input
                  type="text"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-gray-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 cursor-pointer"
              >
                Sign up
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:underline dark:text-primary-500"
                >
                  Signin
                </Link>
              </p>
              {state?.error && <p className="error-msg">{state.error}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterFrom;
