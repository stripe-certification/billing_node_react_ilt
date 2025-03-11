import React from "react";

const Skeleton = ({ count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 h-4 rounded mb-2 max-w-20"
        />
      ))}
    </>
  );
};

export default Skeleton;
