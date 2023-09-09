import { DropzoneOptions } from 'react-dropzone';

export type CustomFile = {
  preview?: string;
  lastModifiedDate?: Date;
} & File;

export type Props = {
  error?: boolean;
  files?: Pick<CustomFile, 'name' | 'preview'>[] | null;
  onSetFiles: (files: CustomFile[] | null) => void;
} & DropzoneOptions;
