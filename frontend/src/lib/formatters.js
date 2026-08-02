export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));

export const calculateDiscount = (price, compareAtPrice) => {
  if (!compareAtPrice || Number(compareAtPrice) <= Number(price)) {
    return null;
  }

  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
};

export const getProductPricing = (product) => {
  const currentPrice = Number(product?.price || 0);
  const originalPrice = Number(product?.compareAtPrice || product?.basePrice || currentPrice);
  const discount = calculateDiscount(currentPrice, originalPrice);

  return {
    currentPrice,
    originalPrice,
    discount,
    hasDiscount: Boolean(discount)
  };
};

export const formatShortDate = (value) =>
  new Intl.DateTimeFormat("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
