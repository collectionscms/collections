import { PhotoCamera } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { File } from '../../../../../config/types.js';
import { logger } from '../../../../../utilities/logger.js';
import { api } from '../../../../utilities/api.js';
import { Props } from '../types.js';

export const FileImageType: React.FC<Props> = ({
  context: { register, setValue, watch },
  field: meta,
}) => {
  const { t } = useTranslation();
  const required = meta.required && { required: t('yup.mixed.required') };
  const [content, setContent] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);

  const getFileImage = (id: string | null): SWRMutationResponse<{ file: File; raw: string }> =>
    useSWRMutation(id ? `/files/${id}` : null, (url) =>
      api.get<{ file: File; raw: string }>(url).then((res) => res.data)
    );

  const createFileImage = () =>
    useSWRMutation(`/files`, async (url: string, { arg }: { arg: Record<string, any> }) => {
      return api.post<{ file: File; raw: string }>(url, arg).then((res) => res.data);
    });

  const { trigger: getFileImageTrigger } = getFileImage(fileId);
  const { trigger: createFileImageTrigger } = createFileImage();

  useEffect(() => {
    const watchId = watch(meta.field);
    if (watchId && watchId !== fileId) {
      setFileId(watchId);
    }
  }, [watch(meta.field)]);

  useEffect(() => {
    const setFileImage = async () => {
      try {
        const res = await getFileImageTrigger();
        if (res) {
          setContent(`data:${res.file.type};base64,${res.raw}`);
          setValue(meta.field, res.file.id);
        }
      } catch (e) {
        logger.error(e);
      }
    };

    if (fileId) {
      setFileImage();
    }
  }, [fileId]);

  const onSelectedFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const params = new FormData();
    params.append('image', file);

    try {
      const res = await createFileImageTrigger(params);
      if (res) {
        setContent(`data:${res.file.type};base64,${res.raw}`);
        setValue(meta.field, res.file.id);
      }
    } catch (e) {
      logger.error(e);
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
