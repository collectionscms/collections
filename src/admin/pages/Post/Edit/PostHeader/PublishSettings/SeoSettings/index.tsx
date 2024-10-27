import { LoadingOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormHelperText, Stack, TextField, Typography } from '@mui/material';
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
  const { trigger: updateContentTrigger } = updateContent(contentId);
  const { trigger: generateSeoTrigger, isMutating: isGenerateSeo } = generateSeo(contentId);

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

  const onClickGenerateSeo = async () => {
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
          sx={{
            color: 'text.primary',
            borderRadius: '16px',
            '&::after': {
              borderRadius: '16px',
            },
          }}
          disabled={isGenerateSeo}
          onClick={onClickGenerateSeo}
        >
          <Stack flexDirection="row" alignItems="center" gap={0.5} sx={{ px: 0.5 }}>
            {isGenerateSeo ? <LoadingOutlined size={16} /> : <Icon name="Sparkles" size={16} />}
            <Typography variant="button">{t('generate_with_ai')}</Typography>
          </Stack>
        </Button>
      </Stack>
      <MainCard>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    onChange={(e) => {
                      setIsEditingMeta(true);
                      field.onChange(e.target.value);
                    }}
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
                    onChange={(e) => {
                      setIsEditingMeta(true);
                      field.onChange(e.target.value);
                    }}
                    error={errors.metaDescription !== undefined}
                  />
                )}
              />
            </Stack>
            <FormHelperText error>{errors.metaDescription?.message}</FormHelperText>
            {isEditingMeta && (
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
            )}
          </Stack>
        </form>
      </MainCard>
    </>
  );
};
