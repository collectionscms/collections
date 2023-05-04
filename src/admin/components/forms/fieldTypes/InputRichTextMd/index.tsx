import 'easymde/dist/easymde.min.css';
import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SimpleMdeReact } from 'react-simplemde-editor';
import { Props } from '../types.js';

export const InputRichTextMdType: React.FC<Props> = ({ control, register, field: meta }) => {
  const { t } = useTranslation();
  const required = meta.required && { required: t('yup.mixed.required') };

  const options = useMemo(() => {
    return {
      spellChecker: false,
      status: false,
    };
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
