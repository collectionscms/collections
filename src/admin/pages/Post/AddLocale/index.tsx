import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormHelperText,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Locale } from '../../../../constant.js';
import { LocalizedPost } from '../../../../types/index.js';
import { logger } from '../../../../utilities/logger.js';
import { FormValues, addContent } from '../../../fields/validators/post/addContent.js';
import { usePost } from '../Context/index.js';

export type Props = {
  open: boolean;
  post: LocalizedPost;
  onClose: () => void;
  onChanged: (locales: string[]) => void;
};

export const AddLocale: React.FC<Props> = ({ open, post, onClose, onChanged }) => {
  const { createBulkContent } = usePost();
  const { t } = useTranslation();
  const { trigger: createBulkContentTrigger } = createBulkContent(post.id);

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
    <>
      <Dialog open={open} onClose={onClose}>
        <Box sx={{ p: 1, py: 1.5 }}>
          <DialogTitle>{t('localized_content_settings')}</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Stack spacing={1} direction="column">
                <Controller
                  name="locales"
                  control={control}
                  render={({ field }) => (
                    <Stack>
                      {Object.values(Locale).map((locale) => {
                        return (
                          <FormControlLabel
                            {...field}
                            key={locale}
                            value={locale}
                            control={
                              <Switch
                                {...field}
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
                                <Typography>{t(`locale.${locale}`)}</Typography>
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                  sx={{ ml: '8px' }}
                                >
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
            </DialogContent>
            <DialogActions>
              <Button color="secondary" variant="outlined" onClick={onClose}>
                {t('cancel')}
              </Button>
              <Button variant="contained" type="submit">
                {t('save')}
              </Button>
            </DialogActions>
          </form>
        </Box>
      </Dialog>
    </>
  );
};
