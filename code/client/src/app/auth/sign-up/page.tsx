"use client";

import SignUpForm from "@/components/auth/SignUpForm";
import { useSearchParams } from "next/navigation";
import { useUserContext } from "@/contexts/UserContext";
import Subscribe from "@/components/subscribe/Subscribe";
import PricingTable from "@/components/landing/PricingTable";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingOverlay } from "@/components";

export default function SignUp() {
  const { isLoggedIn, hasActiveSubscription } = useUserContext();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan")?.toLowerCase() as "monthly" | "yearly";
  const router = useRouter();

  const canAccessAccount = isLoggedIn() && hasActiveSubscription();

  useEffect(() => {
    if (canAccessAccount) {
      router.push("/account");
    }
  }, [router, canAccessAccount]);

  const containerClass = "grid items-center ";

  let content = <LoadingOverlay />;
  if (!isLoggedIn()) {
    content = <SignUpForm />;
  } else if (!plan) {
    content = <PricingTable />;
  } else {
    content = <Subscribe />;
  }

  return <div className={containerClass}>{content}</div>;
}
