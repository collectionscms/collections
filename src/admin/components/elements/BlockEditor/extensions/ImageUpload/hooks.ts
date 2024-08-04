import { DragEvent, useCallback, useEffect, useRef, useState } from 'react';
import { UploadFile } from '../../../../../../types/index.js';
import { logger } from '../../../../../../utilities/logger.js';
import { api } from '../../../../../utilities/api.js';

export const useUploader = ({ onUpload }: { onUpload: (url: string) => void }) => {
  const [loading, setLoading] = useState(false);

  const uploadFile = useCallback(
    async (file?: File) => {
      setLoading(true);
      if (file) {
        const params = new FormData();
        params.append('file', file);

        try {
          const result = await api.post<{ files: UploadFile[] }>('/files', params);
          const url = result.data.files[0].url;
          onUpload(url);
        } catch (error) {
          logger.error(error);
        }
      }
      setLoading(false);
    },
    [onUpload]
  );

  return { loading, uploadFile };
};

export const useFileUpload = () => {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleUploadClick = useCallback(() => {
    fileInput.current?.click();
  }, []);

  return { ref: fileInput, handleUploadClick };
};
