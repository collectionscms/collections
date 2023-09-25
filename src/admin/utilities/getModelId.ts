/**
 * @description Get modelId from pathname
 * @param pathname
 * @returns modelId
 */
export const getModelId = (pathname: string) => {
  const idRegex = /admin\/models\/(\d+)\/contents/;
  const result = pathname.match(idRegex);
  const modelId = result ? result[1] : '';
  return modelId;
};
