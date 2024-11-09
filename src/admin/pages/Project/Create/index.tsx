import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  FormHelperText,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { languages } from '../../../../constants/languages.js';
import { logger } from '../../../../utilities/logger.js';
import { MainCard } from '../../../@extended/components/MainCard/index.js';
import { Confetti } from '../../../components/elements/Confetti/index.js';
import { ConfirmDiscardDialog } from '../../../components/elements/ConfirmDiscardDialog/index.js';
import { LanguageAutocomplete } from '../../../components/elements/LanguageAutocomplete/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  projectSettingsValidator,
} from '../../../fields/validators/projects/projectSettings.validator.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { getUrlForTenant } from '../../../utilities/urlGenerator.js';
import { ProjectContextProvider, useProject } from '../Context/index.js';

const CreateProjectPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const { createProject, checkSubdomainAvailability } = useProject();
  const { trigger: checkSubdomainTrigger } = checkSubdomainAvailability();
  const { trigger: createProjectTrigger, isMutating } = createProject();

  const [showComplete, setShowComplete] = useState(false);
  const {
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      subdomain: '',
      sourceLanguage: '',
    },
    resolver: yupResolver(projectSettingsValidator(t)),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const handleRedirect = () => {
    const subdomain = watch('subdomain');
    window.location.href = getUrlForTenant(subdomain, '/admin');
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      const result = await checkSubdomainTrigger({ subdomain: form.subdomain });
      if (result.available) {
        await createProjectTrigger(form);
        setShowComplete(true);
      } else {
        setError('subdomain', {
          type: 'manual',
          message: t('error.already_registered_project_id'),
        });
      }
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <>
      <Confetti showConfetti={showComplete} />
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <Grid container spacing={2.5} justifyContent="center">
        <Grid xs={12} lg={6}>
          <MainCard>
            {showComplete ? (
              <Box sx={{ py: 1 }}>
                <Typography variant="h4" textAlign="center">
                  {t('project_created')}
                </Typography>
                <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
                  <Button variant="contained" onClick={handleRedirect}>
                    {t('go_to_project_home')}
                  </Button>
                </Stack>
              </Box>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container>
                  <Grid xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="projectName">{t('project_name')}</InputLabel>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            id="projectName"
                            type="text"
                            fullWidth
                            placeholder="My Project"
                            error={errors.name !== undefined}
                          />
                        )}
                      />
                      <FormHelperText error>{errors.name?.message}</FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid xs={12} lg={6} sx={{ mt: 3 }}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="projectName">{t('project_id')}</InputLabel>
                      <Controller
                        name="subdomain"
                        control={control}
                        render={({ field }) => (
                          <Stack direction="row" alignItems="center" gap={1}>
                            <TextField
                              {...field}
                              id="projectName"
                              type="text"
                              fullWidth
                              placeholder="my-project"
                              onChange={(e) => {
                                field.onChange(e.target.value.toLowerCase());
                              }}
                              error={errors.subdomain !== undefined}
                            />
                            <Typography>.collections.dev</Typography>
                          </Stack>
                        )}
                      />
                      <FormHelperText error>{errors.subdomain?.message}</FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid xs={12} sx={{ mt: 3 }}>
                    <InputLabel htmlFor="projectName">{t('source_language')}</InputLabel>
                    <Typography variant="body2" gutterBottom sx={{ my: 1 }} color="text.secondary">
                      {t('source_language_tips')}
                    </Typography>
                  </Grid>
                  <Grid xs={12} lg={6}>
                    <Stack spacing={1} direction="column">
                      <LanguageAutocomplete
                        languages={languages}
                        onChange={(_event, newValue) => {
                          setValue('sourceLanguage', newValue === null ? '' : newValue.code);
                        }}
                      />
                      <FormHelperText error>{errors.sourceLanguage?.message}</FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid xs={12} sx={{ mt: 3 }}>
                    <Stack direction="row" justifyContent="flex-end">
                      <Button variant="contained" type="submit" disabled={isMutating}>
                        {t('add_project')}
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </form>
            )}
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
};

export const CreateProjectPage = ComposeWrapper({ context: ProjectContextProvider })(
  CreateProjectPageImpl
);
