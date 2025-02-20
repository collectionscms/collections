import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../parts/Icon/index.js';
import { useFileUpload } from './hooks.js';

export const ImageUploader = ({ onUpload }: { onUpload: (url: string) => void }) => {
  const { t } = useTranslation();
  const { handleUploadClick, ref } = useFileUpload();

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('upload', e.target.files ? e.target.files[0] : null);
  };

  return (
    <div
      contentEditable={false}
      onClick={handleUploadClick}
      className="!border border-dashed border-gray-500 transition-colors duration-300 ease-in-out hover:border-gray-900 p-2 cursor-pointer"
    >
      <div className="flex flex-row items-center gap-1.5">
        <Icon name="Image" />
        <span>{t('upload_image')}</span>
      </div>
      <input
        hidden
        ref={ref}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif"
        onChange={onFileChange}
      />
    </div>
  );
};

export default ImageUploader;
