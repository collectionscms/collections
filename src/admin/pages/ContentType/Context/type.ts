import { Collection, Field } from '@shared/types';
import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';

export type CollectionContext = {
  getCollection: (id: string, config?: SWRConfiguration) => SWRResponse<Collection>;
  getCollections: () => SWRResponse<Collection[]>;
  createCollection: SWRMutationResponse<Collection>;
  updateCollection: (id: string) => SWRMutationResponse<Collection>;
  getFields: (slug: string, config?: SWRConfiguration) => SWRResponse<Field[]>;
};
