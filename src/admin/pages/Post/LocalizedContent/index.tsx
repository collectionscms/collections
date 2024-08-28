import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, Box, FormHelperText, Stack, TextField, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { languages } from '../../../../constants/languages.js';
import { LocalizedPost } from '../../../../types/index.js';
import { logger } from '../../../../utilities/logger.js';
import { ModalDialog } from '../../../components/elements/ModalDialog/index.js';
import { FormValues, addContent } from '../../../fields/validators/post/addContent.js';
import { usePost } from '../Context/index.js';

export type Props = {
  open: boolean;
  post: LocalizedPost;
  onClose: () => void;
  onChanged: (language: string) => void;
};

export const LocalizedContent: React.FC<Props> = ({ open, post, onClose, onChanged }) => {
  const { createContent } = usePost();
  const { t } = useTranslation();
  const { trigger: createContentTrigger } = createContent(post.id);
  const enabledLanguages = languages.filter((language) => !post.languages.includes(language.code));

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      language: '',
    },
    resolver: yupResolver(addContent()),
  });

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      await createContentTrigger(form);
      onChanged(form.language);
      enqueueSnackbar(t('toast.created_successfully'), { variant: 'success' });
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <ModalDialog
      open={open}
      title={t('add_language_content')}
      body={
        <form>
          <Stack spacing={1} direction="column" sx={{ width: 400 }}>
            <Autocomplete
              fullWidth
              onChange={(_event, newValue) => {
                setValue('language', newValue === null ? '' : newValue.code);
              }}
              options={enabledLanguages}
              autoHighlight
              isOptionEqualToValue={(option, value) => option.code === value?.code}
              getOptionLabel={(option) =>
                `${t(`languages.${option.code}` as unknown as TemplateStringsArray)} (${option.code.toUpperCase()})`
              }
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {t(`languages.${option.code}` as unknown as TemplateStringsArray)}
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {option.code.toUpperCase()}
                  </Typography>
                  {option.sourceLanguageCode && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      - {t('translatable')}
                    </Typography>
                  )}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t('choose_language')}
                  name="language"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'off',
                  }}
                />
              )}
            />
            <FormHelperText error>{errors.language?.message}</FormHelperText>
          </Stack>
        </form>
      }
      execute={{
        action: handleSubmit(onSubmit),
        label: t('save'),
      }}
      cancel={{
        action: onClose,
        label: t('cancel'),
      }}
      disabled={enabledLanguages.length === 0}
    />
  );
};
