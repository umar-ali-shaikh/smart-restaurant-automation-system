export const rupee = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
