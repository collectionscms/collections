import { ProjectSetting } from '@prisma/client';
import { SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';

export type ProjectSettingContext = {
  getProjectSetting: () => SWRResponse<
    ProjectSetting,
    Error,
    {
      suspense: true;
    }
  >;
  updateProjectSetting: () => SWRMutationResponse<void, any, string, Record<string, any>>;
};
