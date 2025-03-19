"use client";

import ManageSubscription from "@/components/account/cards/ManageSubscription";
import Details from "@/components/account/cards/Details";
import { useUserContext } from "@/contexts/UserContext";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { Status } from "@/types";
import { LoadingOverlay } from "@/components";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
function AccountContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">{children}</div>
    </div>
  );
}

export default function Account() {
  const { user, hasActiveSubscription, isLoading, isLoggedIn } =
    useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/auth/sign-up");
    }
  }, [isLoggedIn, router]);

  if (isLoading || !isLoggedIn()) {
    return <LoadingOverlay />;
  }

  if (!hasActiveSubscription()) {
    return (
      <AccountContent>
        <ErrorBanner
          message="You don't have an active subscription. Click here to sign up for a subscription."
          link={{ text: "Sign up", href: "/auth/sign-up" }}
        />
      </AccountContent>
    );
  }

  if (user?.status === Status.PAYMENT_FAILED) {
    return (
      <AccountContent>
        <ErrorBanner message="Your last payment attempt failed. Please update your payment method." />
        <div className="flex justify-center my-10 space-x-10">
          <Details />
          <ManageSubscription />
        </div>
      </AccountContent>
    );
  }

  return (
    <AccountContent>
      <div className="flex justify-center my-10 space-x-10">
        <Details />
        <ManageSubscription />
      </div>
    </AccountContent>
  );
}
