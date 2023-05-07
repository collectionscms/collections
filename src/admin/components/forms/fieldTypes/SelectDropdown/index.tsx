import { MenuItem, Select } from '@mui/material';
import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Props } from '../types';

export const SelectDropdownType: React.FC<Props> = ({
  context: { control, register },
  field: meta,
}) => {
  const { t } = useTranslation();
  const required = meta.required && { required: t('yup.mixed.required') };

  return (
    <Controller
      name={meta.field}
      control={control}
      defaultValue={''}
      render={({ field, fieldState }) => (
        <Select
          {...field}
          error={fieldState.error !== undefined}
          {...register(meta.field, { ...required })}
          disabled={Boolean(meta.readonly)}
          defaultValue={''}
          fullWidth
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {meta.fieldOption?.choices?.map((choice) => (
            <MenuItem value={choice.value} key={choice.value}>
              {choice.label}
            </MenuItem>
          ))}
        </Select>
      )}
    />
  );
};
