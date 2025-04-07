"use client";

import SignUpForm from "@/components/auth/SignUpForm";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react'
import { useUserContext } from "@/contexts/UserContext";
import Subscribe from "@/components/subscribe/Subscribe";
import PricingTable from "@/components/landing/PricingTable";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingOverlay } from "@/components";


function SignUp() {
  const { isLoggedIn, hasActiveSubscription, userLoading } = useUserContext();
  const router = useRouter();

  const canAccessAccount = (!userLoading) && isLoggedIn() && hasActiveSubscription();

  const searchParams = useSearchParams();
  const plan = searchParams.get("plan")?.toLowerCase() as "monthly" | "yearly";

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

/* 
 * Separating this function out is a workaround for Next's requirement that pages that call 
 * useSearchParams should have the call wrapped in a Suspense boundary:
 * https://nextjs.org/docs/app/api-reference/functions/use-search-params.  
 */
export default function SignUpWithSuspense() {
  return (
    <Suspense>
      <SignUp />
    </Suspense>
  )
}