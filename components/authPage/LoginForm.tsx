"use client";
import Link from "next/link";
import { useActionState, useState, useMemo } from "react";

interface loginFormVal {
  success: boolean;
  message: string;
  messageError: {
    email?: string;
    password?: string;
  };
}

async function loginUser(
  previousState: loginFormVal,
  formData: FormData,
): Promise<loginFormVal> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log(email, password, "======= enter value is getting =============");

  if (!email || !email.includes("@")) {
    return {
      ...previousState,
      success: false,
      message: "Invalid email",
      messageError: { email: "Please enter a valid email address with @" },
    };
  }

  if (!password || password.length <= 8) {
    return {
      ...previousState,
      success: false,
      message: "Password requirement failed",
      messageError: { password: "Password must be more than 8 characters." },
    };
  }

  return {
    ...previousState,
    success: true,
    message: `Logged in as ${email}`,
    messageError: {},
  };
}

const LoginForm = () => {
  const [emailVal, setEmailVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");
  const [state, formAction, isPending] = useActionState<loginFormVal, FormData>(
    loginUser,
    {
      success: false,
      message: "",
      messageError: {},
    },
  );

  // Live validation on keystroke (derived, avoids setState in effect)
  const liveErrors = useMemo(() => {
    const errors: { email?: string; password?: string } = {};
    if (emailVal.length > 0 && !emailVal.includes("@")) {
      errors.email = "Missing '@' in your email address.";
    }
    return errors;
  }, [emailVal]);

  // Combine live error feedback with server action feedback
  const displayEmailError = liveErrors.email || state.messageError?.email;
  const displayPasswordError =
    liveErrors.password || state.messageError?.password;

  return (
    <div>
      <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action={formAction} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={emailVal}
                  onChange={(e) => {
                    setEmailVal(e.target.value);
                  }}
                  autoComplete="email"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
              {displayEmailError && (
                <p className="mt-2 text-sm text-red-400" id="email-error">
                  {displayEmailError}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-100"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={passwordVal}
                  onChange={(e) => {
                    setPasswordVal(e.target.value);
                  }}
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
              {/* FIX 2: Now correctly displays when state.messageError.password is provided */}
              {displayPasswordError && (
                <p className="mt-2 text-sm text-red-400" id="password-error">
                  {displayPasswordError}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                {isPending ? "loading..." : "Sign in"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Not a member?{" "}
            <Link
              href="/signup"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              signup
            </Link>
          </p>

          
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
