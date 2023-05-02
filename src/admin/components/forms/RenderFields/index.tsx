import { Box, FormHelperText, InputLabel } from '@mui/material';
import React from 'react';
import { Field } from '../../../../config/types.js';
import { fieldTypes } from '../fieldTypes/index.js';
import { Props } from './types.js';

export const RenderFields: React.FC<Props> = ({ control, register, errors, fields }) => {
  const formFields = fields.filter((field) => !field.hidden);

  const invalidMessage = (field: string): string | null => {
    if (typeof errors[field]?.message === 'string') {
      return `${errors[field]?.message}`;
    }
    return null;
  };

  return (
    <>
      {formFields.map((meta: Field) => {
        const FieldComponent = fieldTypes[meta.interface];

        return (
          <Box key={meta.field}>
            <InputLabel htmlFor={meta.field} required={Boolean(meta.required)}>
              {meta.label}
            </InputLabel>
            <FieldComponent control={control} register={register} errors={errors} field={meta} />
            <FormHelperText error>{invalidMessage(meta.field)}</FormHelperText>
          </Box>
        );
      })}
    </>
  );
};
