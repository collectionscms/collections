import { SWRResponse } from 'swr';
import { ProjectSetting } from '../../../config/types.js';

export type LoginContext = {
  getProjectSetting: () => SWRResponse<
    ProjectSetting,
    Error,
    {
      suspense: true;
    }
  >;
};
