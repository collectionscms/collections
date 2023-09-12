import { SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { ProjectSetting } from '../../../config/types.js';

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
