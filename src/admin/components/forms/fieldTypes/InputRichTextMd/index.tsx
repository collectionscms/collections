import { Box } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';
import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SyntaxHighlighter } from 'superfast-ui';
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

  const getLanguage = (className = '') => {
    const regex = /language-(\w+)\scode-highlight/;
    const match = className.match(regex);
    return match ? match[1] : '';
  };

  const getCode = (nodes: React.ReactNode[] = []): string =>
    nodes
      .map((node) => {
        if (typeof node === 'string') return node;

        const element = node as React.ReactElement;
        if (element.props.children) return getCode(element.props.children);

        return false;
      })
      .filter(Boolean)
      .join('');

  return (
    <Controller
      name={meta.field}
      control={control}
      render={({ field }) => (
        <Box className="container" data-color-mode={mode}>
          <MDEditor
            {...register(meta.field, { ...required })}
            previewOptions={{
              components: {
                code: ({ children, className }) => (
                  <SyntaxHighlighter
                    language={getLanguage(className)}
                    codeString={getCode(children)}
                  />
                ),
              },
            }}
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
