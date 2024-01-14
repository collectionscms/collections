import { ProjectSetting } from '@prisma/client';
import { SWRResponse } from 'swr';

export type LoginContext = {
  getProjectSetting: () => SWRResponse<
    ProjectSetting,
    Error,
    {
      suspense: true;
    }
  >;
};
