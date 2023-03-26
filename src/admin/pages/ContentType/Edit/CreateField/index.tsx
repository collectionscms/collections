import { CloseOutlined } from '@mui/icons-material';
import { Box, Drawer, IconButton, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldInterface } from '../../../../../shared/types';
import ComposeWrapper from '../../../../components/utilities/ComposeWrapper';
import { FieldContextProvider } from './Context';
import InputInterface from './FieldType/input';
import InputMultilineInterface from './FieldType/inputMultiline';
import { Props } from './types';

const CreateField: React.FC<Props> = ({ slug, openState, onSuccess, onClose }) => {
  const [fieldInterface, setFieldInterface] = useState<FieldInterface>(null);
  const theme = useTheme();
  const { t } = useTranslation();

  const onToggle = () => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    onClose();
  };

  const onSelectedFieldInterface = (field: FieldInterface) => {
    fieldInterface === field ? setFieldInterface(null) : setFieldInterface(field);
  };

  return (
    <Box>
      <Drawer
        anchor="right"
        open={openState}
        onClose={onToggle()}
        sx={{ zIndex: theme.zIndex.appBar + 200 }}
      >
        <Box role="presentation">
          <Stack direction="row" columnGap={2} sx={{ p: 1 }}>
            <IconButton aria-label="close" onClick={onClose}>
              <CloseOutlined />
            </IconButton>
            <Box display="flex" alignItems="center">
              <Typography variant="h6">{t('select_field_type')}</Typography>
            </Box>
          </Stack>
          <InputInterface
            slug={slug}
            expanded={fieldInterface === 'input'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onSuccess={onSuccess}
          />
          <InputMultilineInterface
            slug={slug}
            expanded={fieldInterface === 'inputMultiline'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onSuccess={onSuccess}
          />
        </Box>
      </Drawer>
    </Box>
  );
};

export default ComposeWrapper({ context: FieldContextProvider })(CreateField);
