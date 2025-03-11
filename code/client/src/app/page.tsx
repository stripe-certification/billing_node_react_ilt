"use client";

import { Header } from "@/components";
import PricingTable from "@/components/landing/PricingTable";

export default function Home() {
  return (
    <div className="grid items-center">
      <Header />
      <PricingTable />
    </div>
  );
}
