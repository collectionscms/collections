import { Box, Button, Stack, Typography } from '@mui/material';
import React, { ChangeEvent, useCallback } from 'react';
import { Icon } from '../../../Icon/index.js';
import { useFileUpload, useUploader } from './hooks.js';

export const ImageUploader = ({ onUpload }: { onUpload: (url: string) => void }) => {
  const { uploadFile } = useUploader({ onUpload });
  const { handleUploadClick, ref } = useFileUpload();

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => (e.target.files ? uploadFile(e.target.files[0]) : null),
    [uploadFile]
  );

  return (
    <Box
      gap={2}
      sx={{
        border: 1.5,
        borderColor: 'divider',
        borderStyle: 'dashed',
        borderRadius: 1,
        cursor: 'pointer',
      }}
    >
      <Button
        color="secondary"
        variant="text"
        onClick={handleUploadClick}
        sx={{ p: 2, width: '100%', justifyContent: 'flex-start' }}
      >
        <Stack gap={1} direction="row" alignItems="center">
          <Icon name="Image" />
          <Typography variant="caption">Add an image</Typography>
        </Stack>
        <input hidden ref={ref} type="file" accept="image/*" onChange={onFileChange} />
      </Button>
    </Box>
  );
};

export default ImageUploader;
