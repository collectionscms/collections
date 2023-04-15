// A function that takes a value of any type and returns a boolean.
export function castToBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;

  if (value === 0 || value === '0') return false;
  if (value === 1 || value === '1') return true;

  if (value === 'false' || value === false) return false;
  if (value === 'true' || value === true) return true;

  return Boolean(value);
}
