import React, { useState, useEffect } from "react";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useUserContext } from "@/contexts/UserContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import fetchClient from "@/utils/fetchClient";
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) throw new Error("Stripe key is missing");
const stripePromise = loadStripe(stripeKey);

const Subscribe = () => {
  const { user, isLoading } = useUserContext();
  const [checkoutData, setCheckoutData] = useState<{ clientSecret: string }>({
    clientSecret: "",
  });

  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan")?.toLowerCase() as "monthly" | "yearly";

  useEffect(() => {
    if (!user) {
      setError("User not found.");

      return;
    }

    const getSecret = async () => {
    };

    getSecret();
  }, [user, plan]);

  if (isLoading) {
    return <span className="text-black">Loading checkout...</span>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[250px] w-screen">
        <span className="flex justify-center text-2xl m-5 text-red-600">
          {error}
        </span>
        <Link
          href="/auth/sign-in"
          className=" flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-button-color bg-purple hover:bg-purple-hover transition duration-300"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className={`w-full max-w-6xl space-y-8`}>
        <h2 className="text-2xl font-bold text-center mb-6 text-text-color">
          Subscribe now
        </h2>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <div id="checkout">
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
