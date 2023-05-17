import { SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Collection, Field, Relation } from '../../../../../../config/types.js';

export type FieldContext = {
  createField: () => SWRMutationResponse<Field, any, Record<string, any>, any>;
  getCollections: () => SWRResponse<Collection[]>;
  createRelation: () => SWRMutationResponse<Relation, any, Record<string, any>, any>;
};
