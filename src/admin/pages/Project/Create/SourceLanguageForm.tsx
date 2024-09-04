import { yupResolver } from '@hookform/resolvers/yup';
import {
  Autocomplete,
  Box,
  Button,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { enqueueSnackbar } from 'notistack';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { languages } from '../../../../constants/languages.js';
import { logger } from '../../../../utilities/logger.js';
import { ConfirmDiscardDialog } from '../../../components/elements/ConfirmDiscardDialog/index.js';
import {
  FormValues,
  selectSourceLanguage,
} from '../../../fields/validators/projects/selectSourceLanguage.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { useProject } from '../Context/index.js';
import { ProjectData } from './ProjectSettingsForm.js';
import { LanguageAutocomplete } from '../../../components/elements/LanguageAutocomplete/index.js';

export type SourceLanguageData = { sourceLanguage: string };
type Props = {
  projectData: ProjectData;
  sourceLanguageData: SourceLanguageData;
  setSourceLanguageData: (l: SourceLanguageData) => void;
  handleNext: () => void;
  handleBack: () => void;
};

export const SourceLanguageForm: React.FC<Props> = ({
  projectData,
  sourceLanguageData,
  setSourceLanguageData,
  handleNext,
  handleBack,
}) => {
  const { t } = useTranslation();
  const { createProject } = useProject();
  const { trigger, isMutating } = createProject();

  const {
    setValue,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      sourceLanguage: sourceLanguageData.sourceLanguage,
    },
    resolver: yupResolver(selectSourceLanguage()),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      setSourceLanguageData(form);
      await trigger({
        ...projectData,
        sourceLanguage: form.sourceLanguage,
      });
      handleNext();
      enqueueSnackbar(t('toast.created_successfully'), { variant: 'success' });
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        {t('select_source_language')}
      </Typography>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid xs={12} sm={6}>
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
          <Grid xs={12}>
            <Stack direction="row" justifyContent="space-between">
              <Button onClick={handleBack}>{t('back')}</Button>
              <Button variant="contained" type="submit" disabled={isMutating}>
                {t('add_project')}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </>
  );
};
