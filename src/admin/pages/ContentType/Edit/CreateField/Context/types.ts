import { SWRMutationResponse } from 'swr/mutation';
import { Collection, Field, Relation } from '../../../../../../config/types.js';
import { SWRResponse } from 'swr';

export type FieldContext = {
  createField: () => SWRMutationResponse<Field, any, Record<string, any>, any>;
  getCollections: () => SWRResponse<Collection[]>;
  createRelation: () => SWRMutationResponse<Relation, any, Record<string, any>, any>;
};
