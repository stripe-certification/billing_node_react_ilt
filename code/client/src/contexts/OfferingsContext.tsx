import { createContext, useContext, useEffect, useState } from "react";
import { PricedOfferings, isPricedOfferings } from "@/types";
import fetchClient from "@/utils/fetchClient";

interface OfferingsLoading {
  offerings: null;
  offeringsLoading: true;
}

interface OfferingsLoaded {
  offerings: PricedOfferings;
  offeringsLoading: false;
}

type OfferingsContextValue = OfferingsLoading | OfferingsLoaded;

const OfferingsContext = createContext<OfferingsContextValue>({
  offerings: null,
  offeringsLoading: true,
});

export const OfferingsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [offerings, setOfferings] = useState<PricedOfferings | null>(null);
  const [offeringsLoading, setOfferingsLoading] = useState(true);

  useEffect(() => {
    const fetchOfferings = async () => {
      const { data } = await fetchClient.get("offerings");
      if (isPricedOfferings(data)) {
        setOfferings(data);
      }
      setOfferingsLoading(false);
    };

    fetchOfferings();
  }, []);

  const value: OfferingsContextValue = (offeringsLoading || offerings === null) ? { offerings: null, offeringsLoading: true } : { offerings: offerings, offeringsLoading: false };
  return (
    <OfferingsContext.Provider value={value}>
      {children}
    </OfferingsContext.Provider>
  );
};

export function useOfferings() {
  return useContext(OfferingsContext);
}
