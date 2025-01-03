import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormHelperText, Stack, TextField, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../../../../utilities/logger.js';
import {
  FormValues,
  updateSlugValidator,
} from '../../../../../../fields/validators/posts/updateSlug.validator.js';
import { usePost } from '../../../../Context/index.js';

type Props = {
  contentId: string;
  slug: string;
  onUpdated: (slug: string) => void;
};

export const GeneralSettings: React.FC<Props> = ({ contentId, slug, onUpdated }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const { updateContent } = usePost();
  const { trigger: updateContentTrigger } = updateContent(contentId);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      slug,
    },
    resolver: yupResolver(updateSlugValidator(t)),
  });

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      await updateContentTrigger(form);
      setIsEditing(false);
      onUpdated(form.slug);
      enqueueSnackbar(t('toast.updated_successfully'), {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={2}>
        <Stack gap={1}>
          <Typography variant="subtitle1">{t('content_slug')}</Typography>
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="text"
                placeholder="my-first-post"
                sx={{ flexGrow: 1 }}
                onChange={(e) => {
                  setIsEditing(true);
                  field.onChange(e.target.value.toLowerCase());
                }}
                error={errors.slug !== undefined}
              />
            )}
          />
        </Stack>
        <FormHelperText error>{errors.slug?.message}</FormHelperText>
        {isEditing && (
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)}>
              {t('cancel')}
            </Button>
            <Button variant="contained" type="submit">
              {t('save')}
            </Button>
          </Stack>
        )}
      </Stack>
    </form>
  );
};
