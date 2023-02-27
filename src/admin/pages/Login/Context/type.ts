import { SWRConfiguration, SWRResponse } from 'swr';
import { ProjectSetting } from '../../../../shared/types';

export type LoginContext = {
  getProjectSetting: (config?: SWRConfiguration) => SWRResponse<ProjectSetting>;
};
