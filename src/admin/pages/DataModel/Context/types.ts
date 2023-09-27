import { SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { Model, GetModel, GetField, PostModel } from '../../../config/types.js';

export type ModelContext = {
  getModel: (modelId: string) => SWRResponse<
    GetModel,
    Error,
    {
      suspense: true;
    }
  >;
  getModels: () => SWRResponse<
    Model[],
    Error,
    {
      suspense: true;
    }
  >;
  createModel: SWRMutationResponse<number, any, string, Omit<PostModel, 'id'>>;
  updateModel: (id: string) => SWRMutationResponse<void, any, string, Record<string, any>>;
  getFields: (modelId: string) => SWRResponse<
    GetField[],
    Error,
    {
      suspense: true;
    }
  >;
  updateFields: () => SWRMutationResponse<void, any, string, Record<string, any>>;
};
