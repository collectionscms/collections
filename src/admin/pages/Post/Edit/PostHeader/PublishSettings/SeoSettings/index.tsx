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
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../../../../utilities/logger.js';
import { MainCard } from '../../../../../../@extended/components/MainCard/index.js';
import { Icon } from '../../../../../../components/elements/Icon/index.js';
import {
  FormValues,
  updateMetaValidator,
} from '../../../../../../fields/validators/posts/updateMeta.validator.js';
import { usePost } from '../../../../Context/index.js';
import { TitleTooltip } from '../ui/TitleTooltip/index.js';

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
  const { updateContent, generateSeo } = usePost();
  const { trigger: updateContentTrigger, isMutating } = updateContent(contentId);
  const { trigger: generateSeoTrigger, isMutating: isMutatingSummary } = generateSeo(contentId);

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      metaTitle,
      metaDescription,
    },
    resolver: yupResolver(updateMetaValidator()),
  });

  useEffect(() => {
    setValue('metaTitle', metaTitle);
    setValue('metaDescription', metaDescription);
  }, [metaTitle, metaDescription]);

  const onClickSummarize = async () => {
    try {
      const seo = await generateSeoTrigger();
      onUpdated(seo.metaTitle ?? null, seo.metaDescription ?? null);
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
      <Stack flexDirection="row" alignItems="center" sx={{ pb: 1.5 }}>
        <Typography variant={'h4'} sx={{ flexGrow: 1 }}>
          {t('seo')}
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          style={{
            borderRadius: '16px',
          }}
          disabled={isMutatingSummary}
          onClick={onClickSummarize}
        >
          <Stack flexDirection="row" alignItems="center" gap={0.5} sx={{ px: 0.5 }}>
            <Icon name="Sparkles" size={16} />
            <Typography variant="button">{t('ai_summarizes_post')}</Typography>
          </Stack>
        </Button>
      </Stack>
      <MainCard>
        <form onSubmit={handleSubmit(onSubmit)}>
          {isEditingMeta ? (
            <Stack gap={2}>
              <Stack gap={1}>
                <TitleTooltip tooltip={t('seo_title_tooltip')} title={t('seo_title')} />
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
                <TitleTooltip tooltip={t('seo_description_tooltip')} title={t('seo_description')} />
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
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setIsEditingMeta(false)}
                >
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
                  <TitleTooltip tooltip={t('seo_title_tooltip')} title={t('seo_title')} />
                  <Typography>{metaTitle ?? t('not_set')}</Typography>
                </Stack>
                <Stack gap={1}>
                  <TitleTooltip
                    tooltip={t('seo_description_tooltip')}
                    title={t('seo_description')}
                  />
                  <Typography>{metaDescription ?? t('not_set')}</Typography>
                </Stack>
              </Box>
              <IconButton color="secondary" onClick={() => setIsEditingMeta(true)}>
                <Icon name="Pencil" size={16} />
              </IconButton>
            </Stack>
          )}
        </form>
      </MainCard>
    </>
  );
};
