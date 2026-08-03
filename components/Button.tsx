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
        className={`px-4 py-2  ${bgColor} text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400`}
      >
        {buttonName}
      </button>
    </div>
  );
};

export default Button;
