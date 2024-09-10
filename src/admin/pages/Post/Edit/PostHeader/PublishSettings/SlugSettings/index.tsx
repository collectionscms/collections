import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormHelperText, IconButton, Stack, TextField, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../../../../utilities/logger.js';
import { Icon } from '../../../../../../components/elements/Icon/index.js';
import {
  FormValues,
  updateSlugValidator,
} from '../../../../../../fields/validators/post/updateSlug.js';
import { usePost } from '../../../../Context/index.js';

type Props = {
  contentId: string;
  slug: string;
  onUpdated: (slug: string) => void;
};

export const SlugSettings: React.FC<Props> = ({ contentId, slug, onUpdated }) => {
  const { t } = useTranslation();
  const [isEditingSlug, setIsEditingSlug] = useState(false);

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
    resolver: yupResolver(updateSlugValidator()),
  });

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      await updateContentTrigger(form);
      setIsEditingSlug(false);
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
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isEditingSlug ? (
          <>
            <Stack direction="row" gap={2}>
              <Controller
                name="slug"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="text"
                    sx={{ flexGrow: 1 }}
                    error={errors.slug !== undefined}
                  />
                )}
              />
              <Button variant="contained" type="submit">
                {t('save')}
              </Button>
            </Stack>
            <FormHelperText error>{errors.slug?.message}</FormHelperText>
          </>
        ) : (
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography flexGrow={1}>{decodeURIComponent(slug)}</Typography>
            <IconButton onClick={() => setIsEditingSlug(true)}>
              <Icon name="Pencil" size={16} />
            </IconButton>
          </Stack>
        )}
      </form>
    </>
  );
};
