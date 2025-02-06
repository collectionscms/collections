import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  CardHeader,
  Divider,
  FormHelperText,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { enqueueSnackbar } from 'notistack';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { logger } from '../../../../utilities/logger.js';
import { MainCard } from '../../../@extended/components/MainCard/index.js';
import { ConfirmDiscardDialog } from '../../../components/elements/ConfirmDiscardDialog/index.js';
import { Icon } from '../../../components/elements/Icon/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  updateExperienceValidator,
} from '../../../fields/validators/experiences/updateExperience.validator.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { getMeUrl } from '../../../utilities/urlGenerator.js';
import { TitleTooltip } from '../../Post/Edit/PostHeader/PublishSettings/ui/TitleTooltip/index.js';
import { SeoContextProvider, useSeo } from './Context/index.js';
import { ResourceUrl } from './parts/ResourceUrl/index.js';

export const EditSeoPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const knowsUrl = getMeUrl();
  const { getExperiences, createExperience } = useSeo();
  const { data: experiences } = getExperiences();
  const { trigger, isMutating } = createExperience();

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      experiences:
        experiences.length > 0
          ? experiences.map((experience) => ({
              id: experience.id,
              name: experience.name,
              url: experience.url,
              resourceUrls: experience.resourceUrls,
            }))
          : [{ name: '', url: '', resourceUrls: [] }],
    },
    resolver: yupResolver(updateExperienceValidator()),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const handleAddExperience = () => {
    setValue('experiences', [
      ...(watch('experiences') ?? []),
      { name: '', url: '', resourceUrls: [] },
    ]);
  };

  const handleChangeExperience = (index: number, key: 'name' | 'url', value: string) => {
    const newExperienceValues = [...(watch('experiences') ?? [])];
    newExperienceValues[index][key] = value;
    setValue('experiences', newExperienceValues);
  };

  const handleRemoveExperience = (index: number) => {
    const experiences = watch('experiences') ?? [];
    const newExperienceValues = experiences.filter((_, i) => i !== index);
    setValue('experiences', newExperienceValues);
  };

  const handleChangeResourceUrls = (index: number, values: string[]) => {
    const newExperienceValues = [...(watch('experiences') ?? [])];
    newExperienceValues[index].resourceUrls = values;
    setValue('experiences', newExperienceValues);
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      await trigger(form);
      enqueueSnackbar(t('toast.updated_successfully'), {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <Box>
        <CardHeader
          title={t('author_experience')}
          subheader={
            <Trans
              i18nKey="author_experience_description"
              components={{
                knows: <Link href={knowsUrl} />,
              }}
            />
          }
        />
        <Divider />
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid xs={12}>
            <Stack spacing={1}>
              <MainCard title={t('author_experience')} content={false}>
                <Grid spacing={3} sx={{ py: 2, px: 3 }}>
                  <Grid container spacing={1} sx={{ p: 0, mb: 0.5 }}>
                    <Grid xs={3}>
                      <TitleTooltip
                        tooltip={
                          <Typography sx={{ whiteSpace: 'pre-line' }} variant="caption">
                            {t('experience_name_tips')}
                          </Typography>
                        }
                        title={t('experience_name')}
                      />
                    </Grid>
                    <Grid xs={3}>
                      <TitleTooltip
                        tooltip={
                          <Typography sx={{ whiteSpace: 'pre-line' }} variant="caption">
                            {t('experience_url_tips')}
                          </Typography>
                        }
                        title={t('url')}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <TitleTooltip
                        tooltip={
                          <Typography sx={{ whiteSpace: 'pre-line' }} variant="caption">
                            {t('resource_url_tips')}
                          </Typography>
                        }
                        title={t('resource_url')}
                      />
                    </Grid>
                  </Grid>
                  <Stack spacing={1}>
                    {watch('experiences')?.map((value, index) => (
                      <Grid container spacing={1} sx={{ p: 0 }} key={index}>
                        <Grid xs={3} sx={{ pl: 0 }}>
                          <Stack spacing={1}>
                            <TextField
                              id="name"
                              type="text"
                              value={value.name}
                              fullWidth
                              onChange={(e) =>
                                handleChangeExperience(index, 'name', e.target.value)
                              }
                            />
                            <FormHelperText error>
                              {errors.experiences?.[index]?.name?.message}
                            </FormHelperText>
                          </Stack>
                        </Grid>
                        <Grid xs={3}>
                          <Stack spacing={1}>
                            <TextField
                              id="url"
                              type="text"
                              value={value.url}
                              placeholder="https://..."
                              fullWidth
                              onChange={(e) => handleChangeExperience(index, 'url', e.target.value)}
                            />
                            <FormHelperText error>
                              {errors.experiences?.[index]?.url?.message}
                            </FormHelperText>
                          </Stack>
                        </Grid>
                        <Grid xs={6}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ width: '100%' }}>
                              <ResourceUrl
                                optionUrls={experiences?.[index]?.resourceUrls ?? []}
                                initialUrls={value.resourceUrls ?? []}
                                onChange={(values) => {
                                  handleChangeResourceUrls(index, values);
                                }}
                              />
                            </Box>
                            <IconButton onClick={() => handleRemoveExperience(index)}>
                              <Icon name="Trash2" size={16} />
                            </IconButton>
                          </Stack>
                        </Grid>
                      </Grid>
                    ))}
                  </Stack>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<Icon name="Plus" size={16} />}
                    sx={{ mt: 2 }}
                    onClick={handleAddExperience}
                  >
                    <Typography>{t('add_row')}</Typography>
                  </Button>
                </Grid>
              </MainCard>
            </Stack>
          </Grid>
          <Grid xs={12}>
            <Stack direction="row" alignItems="right" justifyContent="right">
              <Button variant="contained" type="submit" disabled={isMutating}>
                {t('save')}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export const EditSeoPage = ComposeWrapper({ context: SeoContextProvider })(EditSeoPageImpl);
