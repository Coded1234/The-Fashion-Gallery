export const formatPrice = (price) => {
  return Math.round(Number(price) || 0).toLocaleString();
};
