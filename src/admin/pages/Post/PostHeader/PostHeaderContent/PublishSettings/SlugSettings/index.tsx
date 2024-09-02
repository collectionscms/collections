import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  FormHelperText,
  IconButton,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
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
  postId: string;
  slug: string;
};

export const SlugSettings: React.FC<Props> = ({ postId, slug }) => {
  const { t } = useTranslation();
  const [isEditingSlug, setIsEditingSlug] = useState(false);

  const { updatePost } = usePost();
  const { trigger: updatePostTrigger } = updatePost(postId);

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
      await updatePostTrigger(form);
      setIsEditingSlug(false);
      enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <>
      <InputLabel sx={{ mb: 1 }}>{t('post_slug')}</InputLabel>
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
            <Typography flexGrow={1}>{slug}</Typography>
            <IconButton onClick={() => setIsEditingSlug(true)}>
              <Icon name="Pencil" size={16} />
            </IconButton>
          </Stack>
        )}
      </form>
    </>
  );
};
