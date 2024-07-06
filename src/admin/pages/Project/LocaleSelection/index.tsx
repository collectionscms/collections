import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
} from '@mui/material';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Locale } from '../../../../constant.js';
import { logger } from '../../../../utilities/logger.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  updatePrimaryLocale,
} from '../../../fields/validators/projects/updatePrimaryLocale.js';
import { ProjectContextProvider, useProject } from '../Context/index.js';

export type Props = {
  currentLocale: string;
  open: boolean;
  onClose: () => void;
  onAdded: (locale: string) => void;
};

const LocaleSelectionImpl: React.FC<Props> = ({ currentLocale, open, onClose, onAdded }) => {
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
      primaryLocale: currentLocale,
    },
    resolver: yupResolver(updatePrimaryLocale()),
  });

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      await trigger(form);
      onAdded(form.primaryLocale);
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 1, py: 1.5 }}>
          <DialogTitle>{t('change_primary_language')}</DialogTitle>
          <DialogContent>
            <FormControl component="fieldset">
              <Controller
                name="primaryLocale"
                control={control}
                render={({ field }) => (
                  <RadioGroup value={field.value} name="radio-buttons-group" row>
                    {Object.values(Locale).map((locale) => (
                      <FormControlLabel
                        {...field}
                        key={locale}
                        value={locale}
                        control={<Radio />}
                        label={t(`locale.${locale}`)}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
              <FormHelperText error>{errors.primaryLocale?.message}</FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" variant="outlined" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button variant="contained" type="submit" disabled={isMutating}>
              {t('update')}
            </Button>
          </DialogActions>
        </Box>
      </form>
    </Dialog>
  );
};

export const LocaleSelection = ComposeWrapper({ context: ProjectContextProvider })(
  LocaleSelectionImpl
);
