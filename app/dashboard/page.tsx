import React from "react";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

const Dashboard = () => {
  return (
    <section>
      <div className="md:flex">
        {/* left side side bar */}
        <div className="relative bg-white dark:bg-gray-800">
          <LeftSidebar />
        </div>

        {/* right side content */}
        <div className="rightside p-6 bg-neutral-secondary text-medium text-body rounded-base w-full">
          <RightSidebar />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
