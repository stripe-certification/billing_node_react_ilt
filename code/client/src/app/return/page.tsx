"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import fetchClient from "@/utils/fetchClient";

function ReturnPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      console.error("Missing session_id");
      return;
    }

    const getSessionStatus = async () => {
      try {
        const { data } = await fetchClient.get(`checkout-session/${sessionId}`);

        return data.status;
      } catch (error) {
        console.error("Error fetching session:", error);
        return null;
      }
    };

    const handleReturn = async () => {
      setIsLoading(true);
      try {
        const sessionStatus = await getSessionStatus();

        if (sessionStatus === "complete") {
          router.push(`/chat`);
        }
      } catch (err) {
        console.error("Error handling return:", err);
        setError(
          "An error occurred while processing your request. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    handleReturn();
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-color">
            Returning...
          </h2>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="space-y-6">Please wait...</div>
        </div>
      </div>
    </div>
  );
}

export default function ReturnWithSuspense() {
  return (
    <Suspense>
      <ReturnPage />
    </Suspense>
  );
}