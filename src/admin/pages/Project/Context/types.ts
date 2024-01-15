import { Project } from '@prisma/client';
import { SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';

export type ProjectContext = {
  getProject: () => SWRResponse<
    Project,
    Error,
    {
      suspense: true;
    }
  >;
  updateProject: () => SWRMutationResponse<void, any, string, Record<string, any>>;
};
