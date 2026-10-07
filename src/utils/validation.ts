// Email Validation
export const isValidEmail = (val: string) => {
  const trimmed = val.trim();
  return trimmed.length > 3 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
};
