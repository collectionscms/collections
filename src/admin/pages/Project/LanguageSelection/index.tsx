import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Language } from '../../../../constant.js';
import { logger } from '../../../../utilities/logger.js';
import { ModalDialog } from '../../../components/elements/ModalDialog/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  updateSourceLanguage,
} from '../../../fields/validators/projects/updateSourceLanguage.js';
import { ProjectContextProvider, useProject } from '../Context/index.js';

export type Props = {
  currentLanguage: string;
  open: boolean;
  onClose: () => void;
  onAdded: (language: string) => void;
};

const LanguageSelectionImpl: React.FC<Props> = ({ currentLanguage, open, onClose, onAdded }) => {
  const { t } = useTranslation();
  const { updateProject } = useProject();
  const { trigger, isMutating } = updateProject();

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      sourceLanguage: currentLanguage,
    },
    resolver: yupResolver(updateSourceLanguage()),
  });

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      await trigger(form);
      onAdded(form.sourceLanguage);
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <ModalDialog
      open={open}
      title={t('change_source_language')}
      body={
        <form>
          <Box sx={{ p: 1, py: 1.5 }}>
            <FormControl component="fieldset">
              <Controller
                name="sourceLanguage"
                control={control}
                render={({ field }) => (
                  <RadioGroup value={field.value} name="radio-buttons-group" row>
                    {Object.values(Language).map((language) => (
                      <FormControlLabel
                        {...field}
                        key={language}
                        value={language}
                        control={<Radio />}
                        label={
                          <Stack direction="row">
                            <Typography>{t(`languages.${language}`)}</Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ ml: '8px' }}>
                              ({currentLanguage})
                            </Typography>
                          </Stack>
                        }
                      />
                    ))}
                  </RadioGroup>
                )}
              />
              <FormHelperText error>{errors.sourceLanguage?.message}</FormHelperText>
            </FormControl>
          </Box>
        </form>
      }
      execute={{ label: t('update'), action: handleSubmit(onSubmit) }}
      cancel={{ label: t('cancel'), action: onClose }}
      disabled={isMutating}
    />
  );
};

export const LanguageSelection = ComposeWrapper({ context: ProjectContextProvider })(
  LanguageSelectionImpl
);
