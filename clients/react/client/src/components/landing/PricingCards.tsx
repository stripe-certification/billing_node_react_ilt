import Link from "next/link";
import { PricedPrepaidCredit } from "@/types";
import { formatPrice, toTitleCase } from "@/utils/helpers";
import { useUserContext } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

const PricingCards = ({
  fixedPrices,
}: {
  fixedPrices: PricedPrepaidCredit[];
}) => {
  const { hasActiveSubscription } = useUserContext();
  const router = useRouter();

  if (fixedPrices.length === 0) {
    return <p className="text-gray-500">No pricing available.</p>;
  }

  return (
    <>
      <h2 className="text-2xl font-bold">Sign Up</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {fixedPrices.map(({ price, credit, lookupKey }, index) => (
          <div
            key={index}
            className="p-6 border rounded-lg shadow-md text-center"
          >
            <h3 className="text-xl font-semibold">{toTitleCase(lookupKey)}</h3>
            <h2 className="text-2xl font-bold mt-2">
              {formatPrice(credit)} Prepaid Credit
            </h2>
            <p className="text-2xl font-bold mt-2">
              {formatPrice(price.unit_amount)}
            </p>

            <button
              disabled={hasActiveSubscription()}
              onClick={() =>
                router.push(`/auth/sign-up?plan=${price.lookup_key}`)
              }
              className={`
                w-full flex justify-center py-2 px-4 
                border border-transparent rounded-md shadow-sm 
                text-sm font-medium text-button-color
                transition duration-300
                ${
                  !hasActiveSubscription()
                    ? "bg-purple hover:bg-purple-hover"
                    : "bg-gray-400"
                }
              `}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
      <span className="flex w-full justify-center text-3xl text-gray-500">
        {hasActiveSubscription() && "Manage your subscription"}
      </span>
    </>
  );
};

export default PricingCards;
