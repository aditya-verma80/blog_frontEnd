import { Eye, EyeOff } from "lucide-react";
import { InputHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function Input({
  label,
  name,
  placeholder,
  error,
  value,
  onChange,
  type = "text",
  className = "",
  ...rest
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField ? (showPassword ? "text" : "password") : type;
  const errorId = `${name}-error`;
  const inputClassName = `block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6 ${
    error
      ? "outline-red-500 focus:outline-red-500"
      : "outline-white/10 focus:outline-indigo-500"
  } ${className} ${isPasswordField ? "pr-10" : ""}`.trim();

  return (
    <div className="w-full mb-4">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-white"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          className={inputClassName}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />

        {isPasswordField && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-sm font-medium text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
