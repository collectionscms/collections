import { useCallback, useRef, useState } from 'react';
// import { uploadFile } from '../../../../../utilities/api.js';

export const useUploader = ({ onUpload }: { onUpload: (url: string) => void }) => {
  const [loading, setLoading] = useState(false);

  const uploadedFile = useCallback(
    async (file?: File) => {
      setLoading(true);
      if (file) {
        console.log(file);
        // try {
        //   const result = await uploadFile(file);
        //   const url = result.files[0].url;
        //   onUpload(url);
        // } catch (error) {
        //   console.error(error);
        // }
      }
      setLoading(false);
    },
    [onUpload]
  );

  return { loading, uploadFile: uploadedFile };
};

export const useFileUpload = () => {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleUploadClick = useCallback(() => {
    fileInput.current?.click();
  }, []);

  return { ref: fileInput, handleUploadClick };
};
