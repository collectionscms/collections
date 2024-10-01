import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  FormHelperText,
  IconButton,
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
  updateMetaValidator,
} from '../../../../../../fields/validators/posts/updateMeta.validator.js';
import { usePost } from '../../../../Context/index.js';

type Props = {
  contentId: string;
  metaTitle: string | null;
  metaDescription: string | null;
  onUpdated: (metaTitle: string | null, metaDescription: string | null) => void;
};

export const SeoSettings: React.FC<Props> = ({
  contentId,
  metaTitle,
  metaDescription,
  onUpdated,
}) => {
  const { t } = useTranslation();
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const { updateContent } = usePost();
  const { trigger: updateContentTrigger } = updateContent(contentId);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      metaTitle,
      metaDescription,
    },
    resolver: yupResolver(updateMetaValidator()),
  });

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      await updateContentTrigger(form);
      setIsEditingMeta(false);
      onUpdated(form.metaTitle ?? null, form.metaDescription ?? null);
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
        {isEditingMeta ? (
          <Stack gap={2}>
            <Stack gap={1}>
              <Typography variant="subtitle1">{t('seo_title')}</Typography>
              <Controller
                name="metaTitle"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="text"
                    sx={{ flexGrow: 1 }}
                    error={errors.metaTitle !== undefined}
                  />
                )}
              />
            </Stack>
            <FormHelperText error>{errors.metaTitle?.message}</FormHelperText>
            <Stack gap={1}>
              <Typography variant="subtitle1">{t('seo_description')}</Typography>
              <Controller
                name="metaDescription"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="text"
                    multiline
                    rows={3}
                    sx={{ flexGrow: 1 }}
                    error={errors.metaDescription !== undefined}
                  />
                )}
              />
            </Stack>
            <FormHelperText error>{errors.metaDescription?.message}</FormHelperText>
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button variant="outlined" color="secondary" onClick={() => setIsEditingMeta(false)}>
                {t('cancel')}
              </Button>
              <Button variant="contained" type="submit">
                {t('save')}
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Stack direction="row" alignItems="center" gap={1}>
            <Box flexGrow="1">
              <Stack gap={1} sx={{ mb: 3 }}>
                <Typography variant="subtitle1">{t('seo_title')}</Typography>
                <Typography>{metaTitle ?? t('not_set')}</Typography>
              </Stack>
              <Stack gap={1}>
                <Typography variant="subtitle1">{t('seo_description')}</Typography>
                <Typography>{metaDescription ?? t('not_set')}</Typography>
              </Stack>
            </Box>
            <IconButton onClick={() => setIsEditingMeta(true)}>
              <Icon name="Pencil" size={16} />
            </IconButton>
          </Stack>
        )}
      </form>
    </>
  );
};
