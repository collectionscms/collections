// This function returns a new object with only the specified keys picked from the original object.
// Alternatives to lodash _.pick.
// ref: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_pick
export function pick(object: any, keys: string[]) {
  return keys.reduce((acc: Record<string, any>, key) => {
    if (object && object.hasOwnProperty(key)) {
      acc[key] = object[key];
    }
    return acc;
  }, {});
}
