import { useRouter } from "next/navigation";
import React from "react";

interface colorType {
  buttonName: string;
  bgColor: string;
  clickRouter: number;
}

const Button = ({ buttonName, bgColor, clickRouter }: colorType) => {
  const router = useRouter();
  return (
    <div>
      <button
        //  onClick={() => router.push(`/blog/${blog.id}`)}
        onClick={() => router.push(`/blog/${clickRouter}`)}
        type="button"
        className={`min-h-11 px-4 py-2 ${bgColor} rounded-lg font-bold text-white transition hover:-translate-y-1`}
      >
        {buttonName}
      </button>
    </div>
  );
};

export default Button;
