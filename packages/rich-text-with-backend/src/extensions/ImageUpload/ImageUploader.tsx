import { Box, Stack, Typography } from '@mui/material';
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
    <Box
      contentEditable={false}
      onClick={handleUploadClick}
      sx={{
        border: 1.5,
        borderColor: 'text.secondary',
        borderStyle: 'dashed',
        borderRadius: 1.5,
        transition: 'border-color 0.3s ease-in-out',
        '&:hover': {
          borderColor: 'text.primary',
        },
        p: 2,
        cursor: 'pointer',
      }}
    >
      <Stack gap={1.5} direction="row" alignItems="center" color="text.secondary">
        <Icon name="Image" />
        <Typography variant="caption">{t('upload_image')}</Typography>
      </Stack>
      <input
        hidden
        ref={ref}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif"
        onChange={onFileChange}
      />
    </Box>
  );
};

export default ImageUploader;
