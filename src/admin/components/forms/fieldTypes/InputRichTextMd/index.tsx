import { Box } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';
import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useColorMode } from '../../../utilities/ColorMode/index.js';
import { Props } from '../types.js';
import { commands } from './commands.js';
import './index.css';

export const InputRichTextMdType: React.FC<Props> = ({
  form: { control, register },
  field: meta,
}) => {
  const { t } = useTranslation();
  const { mode } = useColorMode();
  const required = meta.required && { required: t('yup.mixed.required') };

  return (
    <Controller
      name={meta.field}
      control={control}
      render={({ field }) => (
        <Box className="container" data-color-mode={mode}>
          <MDEditor
            {...register(meta.field, { ...required })}
            value={field.value}
            height={400}
            onChange={(value) => field.onChange(value)}
            commands={[
              commands.bold(t('bold')),
              commands.italic(t('italic')),
              commands.strikethrough(t('strikethrough')),
              commands.unorderedList(t('unordered_list')),
              commands.orderedList(t('ordered_list')),
              commands.link(t('link')),
              commands.image(t('image')),
            ]}
            extraCommands={[commands.fullScreen(t('full_screen'))]}
          />
        </Box>
      )}
    />
  );
};
