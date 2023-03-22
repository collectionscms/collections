import { SWRMutationResponse } from 'swr/mutation';

export type DocumentContext = {
  deleteDocument: (id: string, slug: string) => SWRMutationResponse;
};
