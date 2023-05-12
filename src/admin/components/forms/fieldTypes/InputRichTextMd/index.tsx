import 'easymde/dist/easymde.min.css';
import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SimpleMdeReact } from 'react-simplemde-editor';
import { logger } from '../../../../../utilities/logger.js';
import { useContent } from '../../../../pages/collections/Context/index.js';
import { Props } from '../types.js';

export const InputRichTextMdType: React.FC<Props> = ({
  form: { control, register },
  field: meta,
}) => {
  const { t } = useTranslation();
  const required = meta.required && { required: t('yup.mixed.required') };

  const { createFileImage } = useContent();
  const { trigger: createFileImageTrigger } = createFileImage();

  const imageUploadFunction = async (file: File, onSuccess: (url: string) => void) => {
    const params = new FormData();
    params.append('image', file);

    try {
      const res = await createFileImageTrigger(params);
      if (res) {
        onSuccess(`${window.location.origin}/assets/${res.file.fileNameDisk}`);
      }
    } catch (e) {
      logger.error(e);
    }
  };

  const options = useMemo(() => {
    return {
      uploadImage: true,
      imageUploadFunction,
      spellChecker: false,
      status: false,
      imageAccept: 'image/png, image/jpeg, image/gif, image/webp',
      placeholder: 'Type in Markdown',
    } as EasyMDE.Options;
  }, []);

  return (
    <Controller
      name={meta.field}
      control={control}
      render={({ field }) => (
        <SimpleMdeReact
          {...register(meta.field, { ...required })}
          onChange={(value: string) => {
            field.onChange(value);
          }}
          options={options}
          value={field.value}
        />
      )}
    />
  );
};
