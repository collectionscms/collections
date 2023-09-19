/**
 * @description Get collectionId from pathname
 * @param pathname
 * @returns collectionId
 */
export const getCollectionId = (pathname: string) => {
  const idRegex = /admin\/collections\/(\d+)\/contents/;
  const result = pathname.match(idRegex);
  const collectionId = result ? result[1] : '';
  return collectionId;
};
