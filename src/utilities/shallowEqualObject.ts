// This function takes an object and a target object and returns true if every key-value.
export const shallowEqualObject = (object: Object, target: Object): boolean => {
  return Object.keys(object).every((key) => {
    return object[key] === target[key];
  });
};
