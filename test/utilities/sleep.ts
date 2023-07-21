/**
 * Wrapper method for setTimeout.
 * It can be used to delay execution of code.
 * @param msec
 * @returns
 */
export const sleep = (msec: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, msec);
  });
};
