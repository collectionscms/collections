import { Icon } from '@/extensions/parts/Icon';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/parts/Button';
import { Spinner } from '@/parts/Spinner';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropZone, useFileUpload, useUploader } from './hooks';

export const ImageUploader = ({
  onUpload,
  onDelete,
}: {
  onUpload: (url: string) => void;
  onDelete: () => void;
}) => {
  const { t } = useTranslation();
  const { loading, uploadFile } = useUploader({ onUpload });
  const { handleUploadClick, ref } = useFileUpload();
  const { draggedInside, onDrop, onDragEnter, onDragLeave } = useDropZone({ uploader: uploadFile });
  const [showClose, setShowClose] = useState(false);

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => (e.target.files ? uploadFile(e.target.files[0]) : null),
    [uploadFile]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 rounded-lg min-h-[10rem] bg-opacity-80">
        <Spinner className="text-neutral-500" size={1.5} />
      </div>
    );
  }

  const wrapperClass = cn(
    'flex flex-col items-center justify-center px-8 py-10 rounded-lg bg-opacity-80 relative',
    draggedInside && 'bg-neutral-100'
  );

  return (
    <div
      className={wrapperClass}
      onDrop={onDrop}
      onDragOver={onDragEnter}
      onDragLeave={onDragLeave}
      contentEditable={false}
      onMouseEnter={() => setShowClose(true)}
      onMouseLeave={() => setShowClose(false)}
    >
      {showClose && (
        <Button
          buttonSize="small"
          variant="tertiary"
          className="absolute top-0 right-0"
          onClick={onDelete}
        >
          <Icon name="X" />
        </Button>
      )}
      <Icon name="Image" className="w-12 h-12 mb-4 text-black opacity-20" />
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="text-sm font-medium text-center text-neutral-400">
          {!draggedInside && t('drag_and_drop_image')}
        </div>
        <div>
          <Button
            disabled={draggedInside}
            onClick={handleUploadClick}
            variant="primary"
            buttonSize="small"
          >
            <Icon name="Upload" />
            {t('upload_image')}
          </Button>
        </div>
      </div>
      <input
        className="w-0 h-0 overflow-hidden opacity-0"
        ref={ref}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif"
        onChange={onFileChange}
      />
    </div>
  );
};

export default ImageUploader;
