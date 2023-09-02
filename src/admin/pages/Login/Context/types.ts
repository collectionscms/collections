import { SWRConfiguration, SWRResponse } from 'swr';
import { ProjectSetting } from '../../../config/types.js';

export type LoginContext = {
  getProjectSetting: (config?: SWRConfiguration) => SWRResponse<ProjectSetting>;
};
