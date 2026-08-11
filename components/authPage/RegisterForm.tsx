"use client";
import { registerUser } from "@/redux/slices/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Input from "../Input";

// type RegisterFormValues = {
//   username: string;
//   email: string;
//   password: string;
//   age: string | number;
//   address: string;
// };

const RegisterForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { loading } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    address: "",
  });

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     // router.push("/");
  //   }
  // }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((pre) => ({
      ...pre,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 2) {
      newErrors.username = "Username must be at least 2 characters long";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.trim().length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.confirmPassword.trim() !== formData.password.trim()) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = "Age must be a positive number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const result = await dispatch(
        registerUser({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          age: Number(formData.age),
          address: formData.address.trim(),
        }),
      ).unwrap();
      toast.success(result.message);
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Unable to create your account",
      );
    }
  };

  return (
    <main id="main-content" className="min-h-screen max-w-full bg-gray-900">
      <div className="mx-auto flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:py-10">
        <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 border">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-white md:text-2xl dark:text-white">
              Create your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                name="username"
                error={errors.username}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                placeholder="Enter your name"
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                name="email"
                error={errors.email}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                placeholder="Enter your email"
              />

              <Input
                label="Age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                name="age"
                error={errors.age}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                placeholder="Enter your age"
              />

              <Input
                label="Address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                name="address"
                error={errors.address}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                placeholder="Enter your address"
              />

              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                name="password"
                error={errors.password}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                placeholder="Enter your password"
              />

              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                name="confirmPassword"
                error={errors.confirmPassword}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                placeholder="Confirm your password"
              />

              <button
                type="submit"
                disabled={loading === true}
                className="min-h-11 w-full cursor-pointer rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-100"
              >
                {loading ? "Submitting..." : "Sign up"}
              </button>
              <p className="text-sm text-gray-300">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-blue-300 underline hover:text-blue-200"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegisterForm;
