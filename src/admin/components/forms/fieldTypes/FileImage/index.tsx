import { CameraFilled } from '@ant-design/icons';
import { Box, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../../utilities/logger.js';
import { ContentContextProvider, useContent } from '../../../../pages/collections/Context/index.js';
import { ComposeWrapper } from '../../../utilities/ComposeWrapper/index.js';
import { Props } from '../types.js';

const FileImageTypeImpl: React.FC<Props> = ({
  form: { register, setValue, watch },
  field: meta,
}) => {
  const { t } = useTranslation();
  const required = meta.required && { required: t('yup.mixed.required') };
  const [content, setContent] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);

  const { getFileImage, createFileImage } = useContent();
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
          setContent(res.file.url || null);
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
        setContent(res.file.url || null);
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
        <IconButton color="secondary" component="label" sx={{ fontSize: '30px' }}>
          <input hidden accept="image/*" type="file" onChange={onSelectedFile} />
          <CameraFilled />
        </IconButton>
        <input hidden {...register(meta.field, { ...required })} />
      </Box>
    </Box>
  );
};

export const FileImageType = ComposeWrapper({ context: ContentContextProvider })(FileImageTypeImpl);
