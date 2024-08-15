import { yupResolver } from '@hookform/resolvers/yup';
import { FormControlLabel, FormHelperText, Stack, Switch, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Locale } from '../../../../constant.js';
import { LocalizedPost } from '../../../../types/index.js';
import { logger } from '../../../../utilities/logger.js';
import { ModalDialog } from '../../../components/elements/ModalDialog/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import { FormValues, addContent } from '../../../fields/validators/post/addContent.js';
import { usePost } from '../Context/index.js';

export type Props = {
  open: boolean;
  post: LocalizedPost;
  onClose: () => void;
  onChanged: (locales: string[]) => void;
};

export const LocalizedContent: React.FC<Props> = ({ open, post, onClose, onChanged }) => {
  const { hasPermission } = useAuth();
  const { createBulkContent } = usePost();
  const { t } = useTranslation();
  const { trigger: createBulkContentTrigger } = createBulkContent(post.id);
  const hasTrashPost = hasPermission('trashPost');
  const enabledLocales = Object.values(Locale).filter((locale) => !post.locales.includes(locale));

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      locales: post.locales,
    },
    resolver: yupResolver(addContent()),
  });

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      await createBulkContentTrigger(form);
      onChanged(form.locales);
      enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <ModalDialog
      open={open}
      title={t('add_localized_content')}
      body={
        <form>
          <Stack spacing={1} direction="column">
            <Controller
              name="locales"
              control={control}
              render={({ field }) => (
                <Stack>
                  {enabledLocales.length === 0 && <>{t('no_additional_languages')}</>}
                  {enabledLocales.map((locale) => {
                    return (
                      <FormControlLabel
                        {...field}
                        key={locale}
                        value={locale}
                        control={
                          <Switch
                            {...field}
                            disabled={!hasTrashPost}
                            checked={watch('locales').includes(locale)}
                            onChange={() => {
                              if (!field.value.includes(locale)) {
                                field.onChange([...field.value, locale]);
                                return;
                              }
                              const newTopics = field.value.filter((topic) => topic !== locale);
                              field.onChange(newTopics);
                            }}
                          />
                        }
                        label={
                          <Stack direction="row">
                            <Typography>{t(`languages.${locale}`)}</Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ ml: '8px' }}>
                              ({locale})
                            </Typography>
                          </Stack>
                        }
                      />
                    );
                  })}
                </Stack>
              )}
            />
            <FormHelperText error>{errors.locales?.message}</FormHelperText>
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
      disabled={enabledLocales.length === 0}
    />
  );
};
