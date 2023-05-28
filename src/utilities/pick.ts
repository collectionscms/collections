// This function returns a new object with only the specified keys picked from the original object.
// Alternatives to lodash _.pick.
// ref: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_pick
export function pick(obj: any, ...keys: string[][]) {
  const ret: Record<string, any> = {};
  keys.flat().forEach((key) => {
    if (obj[key]) ret[key] = obj[key];
  });
  return ret;
}
