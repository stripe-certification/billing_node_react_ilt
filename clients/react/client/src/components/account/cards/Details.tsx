import React from "react";

import { useUserContext } from "@/contexts/UserContext";

const Details = () => {
  const { user } = useUserContext();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p>Email: {user?.email}</p>
    </div>
  );
};

export default Details;
