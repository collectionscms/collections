import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { ProjectSetting } from '../../../config/types.js';

export type ProjectSettingContext = {
  getProjectSetting: (config?: SWRConfiguration) => SWRResponse<ProjectSetting>;
  updateProjectSetting: () => SWRMutationResponse<void, any, string, Record<string, any>>;
};
