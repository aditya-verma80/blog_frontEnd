import React from "react";

const API_URL = process.env.API_BASE_URL || "http://localhost:5000/api";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <div className="">
        <p>edit id no is {id}</p>

        



      </div>
    </>
  );
};

export default EditBlogPage;
