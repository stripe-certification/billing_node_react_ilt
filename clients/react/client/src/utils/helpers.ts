
export function formatPrice(
  amount: number | null,
  language?: string,
  currency?: string
) {
  if (amount === null) {
    return "Loading";
  }

  return new Intl.NumberFormat(language || "en", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount / (currency === "jpy" ? 1 : 100));
}

export const toTitleCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);