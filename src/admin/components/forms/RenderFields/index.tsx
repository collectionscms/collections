import { Box, FormHelperText, InputLabel } from '@mui/material';
import React from 'react';
import { Field } from '../../../../config/types.js';
import { fieldTypes } from '../fieldTypes/index.js';
import { Props } from './types.js';

export const RenderFields: React.FC<Props> = ({ context, fields }) => {
  const {
    formState: { errors },
  } = context;
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
            <FieldComponent context={context} field={meta} />
            <FormHelperText error>{invalidMessage(meta.field)}</FormHelperText>
          </Box>
        );
      })}
    </>
  );
};
