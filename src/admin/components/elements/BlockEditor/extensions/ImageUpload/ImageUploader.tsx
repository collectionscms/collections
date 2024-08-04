import { Box, Button, Stack } from '@mui/material';
import React, { ChangeEvent, useCallback } from 'react';
import { Icon } from '../../ui/Icon/index.js';
import { useDropZone, useFileUpload, useUploader } from './hooks.js';
import { ref } from 'yup';

export const ImageUploader = ({ onUpload }: { onUpload: (url: string) => void }) => {
  const { uploadFile } = useUploader({ onUpload });
  const { handleUploadClick, ref } = useFileUpload();
  const { draggedInside, onDrop, onDragEnter, onDragLeave } = useDropZone({ uploader: uploadFile });

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => (e.target.files ? uploadFile(e.target.files[0]) : null),
    [uploadFile]
  );

  return (
    <Box onDrop={onDrop} onDragOver={onDragEnter} onDragLeave={onDragLeave} gap={2}>
      <Icon name="Image" />
      <Stack>
        <div className="text-sm font-medium text-center text-neutral-400 dark:text-neutral-500">
          {draggedInside ? 'Drop image here' : 'Drag and drop or'}
        </div>
        <Button
          disabled={draggedInside}
          onClick={handleUploadClick}
          startIcon={<Icon name="Upload" size={18} />}
          color="secondary"
          variant="contained"
          size="small"
        >
          Upload an image
        </Button>
      </Stack>
      <input hidden ref={ref} type="file" accept="image/*" onChange={onFileChange} />
    </Box>
  );
};

export default ImageUploader;
