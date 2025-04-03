import React, { useState } from "react";
import { AxiosError } from "axios";
import fetchClient from "@/utils/fetchClient";
import ErrorBanner from "../../ui/ErrorBanner";
import { useUserContext } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

const ManageSubscription = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const showCustomerPortal = async (action: string) => {
    setError(null);
    try {
      const { data } = await fetchClient.post("/users/manage", { action });
      router.push(data.url);
    } catch (err) {
      console.error(err);
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message || "An error occurred. Please try again."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {error && <ErrorBanner message={error} />}

      <div className="space-y-6 w-full">
        <button
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-button-color bg-purple hover:bg-purple-hover transition duration-300"
          onClick={(e) => {
            e.preventDefault();
            showCustomerPortal("account");
          }}
        >
          View Subscription Details
        </button>
        <button
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-button-color bg-purple hover:bg-purple-hover transition duration-300"
          onClick={(e) => {
            e.preventDefault();
            showCustomerPortal("payment_method_update");
          }}
        >
          Update Your Payment Information
        </button>
        <button
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-button-color bg-purple hover:bg-purple-hover transition duration-300"
          onClick={(e) => {
            e.preventDefault();
            showCustomerPortal("subscription_cancel");
          }}
        >
          Cancel Your Subscription
        </button>
      </div>
    </div>
  );
};

export default ManageSubscription;
