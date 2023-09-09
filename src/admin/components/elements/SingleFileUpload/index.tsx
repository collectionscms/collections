import { InboxOutlined } from '@ant-design/icons';
import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles/index.js';
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { CustomFile, Props } from './types.js';

const DropzoneWrapper = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.secondary.main}`,
  '&:hover': {
    opacity: 0.72,
    cursor: 'pointer',
  },
}));

export const SingleFileUpload: React.FC<Props> = (props) => {
  const { error, files, accept, onSetFiles } = props;
  const { t } = useTranslation();
  const theme = useTheme();

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept,
    multiple: false,
    onDrop: (acceptedFiles: CustomFile[]) => {
      onSetFiles(
        acceptedFiles.map((file: CustomFile) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const thumbs =
    files &&
    files.map((item: Pick<CustomFile, 'name' | 'preview'>) => (
      <img
        key={item.name}
        alt={item.name}
        src={item.preview}
        style={{
          top: 8,
          left: 8,
          borderRadius: 2,
          position: 'absolute',
          width: 'calc(100% - 16px)',
          height: 'calc(100% - 16px)',
          objectFit: 'cover',
          background: theme.palette.background.paper,
        }}
        onLoad={() => {
          URL.revokeObjectURL(item.preview!);
        }}
      />
    ));

  const handleRemove = () => {
    onSetFiles(null);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <DropzoneWrapper
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter',
          }),
          ...(files && {
            padding: '12% 0',
          }),
        }}
      >
        <input {...getInputProps()} />
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          direction="column"
          sx={{ width: 1, textAlign: 'center' }}
        >
          <InboxOutlined style={{ fontSize: '52px' }} />
          <Stack sx={{ p: 2 }} spacing={1}>
            <Typography variant="h5">{t('drag_and_drop_title')}</Typography>
            <Typography color="secondary">
              {t('drag_and_drop_body1')}
              <Typography component="span" color="primary" sx={{ textDecoration: 'underline' }}>
                {t('drag_and_drop_body2')}
              </Typography>
            </Typography>
          </Stack>
        </Stack>
        {thumbs}
      </DropzoneWrapper>

      {files && files.length > 0 && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
          <Button variant="contained" color="error" onClick={handleRemove}>
            {t('delete')}
          </Button>
        </Stack>
      )}
    </Box>
  );
};
