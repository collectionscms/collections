import { ProjectSetting } from '@shared/types';
import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';

export type ProjectSettingContext = {
  getProjectSetting: (config?: SWRConfiguration) => SWRResponse<ProjectSetting>;
  updateProjectSetting: () => SWRMutationResponse;
};
