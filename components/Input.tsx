import { InputHTMLAttributes } from "react";

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
}: InputProps) {
  return (
    <div className="w-full mb-4">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-white"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6 
          ${
          error
            ? "outline-red-500 focus:outline-red-500"
            : "outline-white/10 focus:outline-indigo-500"
        }`}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
