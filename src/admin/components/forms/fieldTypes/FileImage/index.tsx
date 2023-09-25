import { Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../../utilities/logger.js';
import { File } from '../../../../config/types.js';
import { ContentContextProvider, useContent } from '../../../../pages/models/Context/index.js';
import { SingleFileUpload } from '../../../elements/SingleFileUpload/index.js';
import { CustomFile } from '../../../elements/SingleFileUpload/types.js';
import { ComposeWrapper } from '../../../utilities/ComposeWrapper/index.js';
import { Props } from '../types.js';

const FileImageTypeImpl: React.FC<Props> = ({
  form: { register, setValue, watch },
  field: meta,
}) => {
  const { t } = useTranslation();
  const required = meta.required && { required: t('yup.mixed.required') };
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);

  const { getFileImage, createFileImage } = useContent();
  const { trigger: getFileImageTrigger } = getFileImage(fileId);
  const { trigger: createFileImageTrigger } = createFileImage();

  useEffect(() => {
    const setFileImage = async () => {
      try {
        const res = await getFileImageTrigger();
        if (res) {
          setFile(res.file || null);
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

  const value = watch(meta.field);

  useEffect(() => {
    if (value === undefined) {
      initializeFieldAsNull();
    }

    if (value && value !== fileId) {
      setFileId(value);
    }
  }, [value]);

  const initializeFieldAsNull = () => {
    setValue(meta.field, null);
  };

  const handleSetFiles = async (files: CustomFile[] | null) => {
    const file = files?.[0];
    if (!file) {
      setFile(null);
      setValue(meta.field, null);
      return;
    }

    const params = new FormData();
    params.append('image', file);

    try {
      const res = await createFileImageTrigger(params);
      setValue(meta.field, res.file.id);
    } catch (e) {
      logger.error(e);
      setFile(null);
    }
  };

  return (
    <>
      <Stack spacing={1.5} alignItems="center">
        <SingleFileUpload
          accept={{ 'image/*': [] }}
          files={file ? [{ name: file.file_name, preview: file.url }] : null}
          onSetFiles={handleSetFiles}
        />
      </Stack>
      <input hidden {...register(meta.field, { ...required })} />
    </>
  );
};

export const FileImageType = ComposeWrapper({ context: ContentContextProvider })(FileImageTypeImpl);
