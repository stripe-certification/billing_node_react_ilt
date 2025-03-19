import { PricedLlmModel } from "@/types";
import { formatPrice } from "@/utils/helpers";

const ModelsSection = ({ modelPrices }: { modelPrices: PricedLlmModel[] }) => {
  if (modelPrices.length === 0) {
    return <p className="text-gray-500">No model pricing available.</p>;
  }

  return (
    <div className="max-w-3xl text-center">
      <h2 className="text-2xl font-semibold">Available Models</h2>
      <p className="text-gray-600">
        Choose from our three powerful AI models, each priced per token.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {modelPrices.map(({ displayName, monthlyPrice }, index) => {
          const tokenCount = monthlyPrice.transform_quantity?.divide_by;
          return (
            <div key={index} className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">{displayName}</h3>
              <p className="text-gray-500">
                {formatPrice(monthlyPrice.unit_amount)} /{" "}
                {tokenCount ? `${tokenCount} tokens` : "token"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModelsSection;
