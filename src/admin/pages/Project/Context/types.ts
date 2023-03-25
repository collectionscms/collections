import { SWRConfiguration, SWRResponse } from 'swr';
import { SWRMutationResponse } from 'swr/mutation';
import { ProjectSetting } from '../../../../shared/types';

export type ProjectSettingContext = {
  getProjectSetting: (config?: SWRConfiguration) => SWRResponse<ProjectSetting>;
  updateProjectSetting: () => SWRMutationResponse<void, any, Record<string, any>, any>;
};
