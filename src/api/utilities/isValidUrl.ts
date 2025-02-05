export const isValidUrl = (val: string | null): boolean => {
  if (val === null || val === '') return true;
  try {
    new URL(val);
    return true;
  } catch {
    return false;
  }
};
