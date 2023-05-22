import { SWRMutationResponse } from 'swr/mutation';
import { Collection, Field, Relation } from '../../../../../../config/types.js';
import { SWRResponse } from 'swr';

export type FieldContext = {
  createField: () => SWRMutationResponse<Field, any, Record<string, any>, any>;
  getCollections: () => SWRResponse<Collection[]>;
  createRelations: () => SWRMutationResponse<Relation, any, Record<string, any>, any>;
};
