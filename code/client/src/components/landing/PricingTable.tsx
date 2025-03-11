import React from "react";
import ModelsSection from "@/components/landing/ModelsSection";
import PricingCards from "@/components/landing/PricingCards";
import { useOfferings } from "@/contexts/OfferingsContext";
import { Spinner } from "../ui";

const PricingTable = () => {
  const { offerings, offeringsLoading } = useOfferings();

  if (offeringsLoading) {
    return (
      <div className="flex justify-center items-center bg-background">
        <div className="flex flex-col items-center">
          <Spinner />
          <p className="mt-4 text-lg font-semibold text-text-color">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  const modelsArray = offerings.models ? Object.values(offerings.models) : [];
  const prepaidArray = offerings.prepaid
    ? Object.values(offerings.prepaid)
    : [];

  return (
    <section className="flex flex-col items-center p-6 space-y-6">
      <ModelsSection modelPrices={modelsArray} />
      <PricingCards fixedPrices={prepaidArray} />
    </section>
  );
};

export default PricingTable;
