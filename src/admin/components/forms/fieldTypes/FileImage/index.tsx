import { PhotoCamera } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { File } from '../../../../../config/types.js';
import { api } from '../../../../utilities/api.js';
import { Props } from '../types.js';

export const FileImageType: React.FC<Props> = ({
  context: { register, setValue, watch },
  field: meta,
}) => {
  const { t } = useTranslation();
  const required = meta.required && { required: t('yup.mixed.required') };
  const [content, setContent] = useState<string | null>(null);
  const [fileId, setFileId] = useState<number | null>(null);

  useEffect(() => {
    const getFile = async (fileId: string) => {
      const res = await api.get<{ file: File; raw: string }>(`/files/${fileId}`);
      setContent(`data:${res.data.file.type};base64,${res.data.raw}`);
      setValue(meta.field, res.data.file.id);
      setFileId(res.data.file.id);
    };

    const watchId = watch(meta.field);
    if (watchId && watchId !== fileId) {
      getFile(watchId);
    }
  }, [watch(meta.field)]);

  const onSelectedFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const params = new FormData();
      params.append('image', file);
      const res = await api.post<{ file: File; raw: string }>('/files', params);
      setContent(`data:${res.data.file.type};base64,${res.data.raw}`);
      setValue(meta.field, res.data.file.id);
      setFileId(res.data.file.id);
    }
  };

  return (
    <Box
      sx={{
        border: 1,
        borderStyle: `${content ? 'none' : 'dashed'}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          crop: 'center',
          p: 8,
          backgroundImage: `url(${content || null})`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <IconButton color="primary" aria-label="upload picture" component="label">
          <input hidden accept="image/*" type="file" onChange={onSelectedFile} />
          <PhotoCamera />
        </IconButton>
        <input hidden {...register(meta.field, { ...required })} />
      </Box>
    </Box>
  );
};
