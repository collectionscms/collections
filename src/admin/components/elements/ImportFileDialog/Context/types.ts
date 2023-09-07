import { SWRMutationResponse } from 'swr/mutation';

export type ImportFileContext = {
  importWordPressXml: () => SWRMutationResponse<
    { file: File; raw: string },
    any,
    string,
    Record<string, any>
  >;
};
