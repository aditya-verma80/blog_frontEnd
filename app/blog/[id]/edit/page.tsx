import React from "react";

const EditBlogPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
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
