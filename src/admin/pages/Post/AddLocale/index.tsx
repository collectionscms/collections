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
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material';
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
  onAdded: (locale: string) => void;
};

export const AddLocale: React.FC<Props> = ({ open, post, onClose, onAdded }) => {
  const { createContent } = usePost();
  const { t } = useTranslation();
  const { trigger } = createContent(post.id);
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      locale: '',
    },
    resolver: yupResolver(addContent()),
  });

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      await trigger(form);
      onAdded(form.locale);
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 1, py: 1.5 }}>
        <DialogTitle>{t('add_localized_content')}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={1} direction="column">
              <Controller
                name="locale"
                control={control}
                render={({ field }) => (
                  <RadioGroup value={field.value} name="radio-buttons-group" row>
                    {Object.values(Locale).map((locale) => (
                      <FormControlLabel
                        {...field}
                        key={locale}
                        value={locale}
                        disabled={post.locales.includes(locale)}
                        control={<Radio />}
                        label={t(`locale.${locale}`)}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
              <FormHelperText error>{errors.locale?.message}</FormHelperText>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" variant="outlined" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button variant="contained" type="submit">
              {t('add')}
            </Button>
          </DialogActions>
        </form>
      </Box>
    </Dialog>
  );
};
