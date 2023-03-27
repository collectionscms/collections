import { CloseOutlined } from '@mui/icons-material';
import { Box, Drawer, IconButton, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldInterface } from '../../../../../shared/types';
import ComposeWrapper from '../../../../components/utilities/ComposeWrapper';
import { FieldContextProvider } from './Context';
import DateTimeType from './FieldType/dateTime';
import FileType from './FieldType/file';
import FileImageType from './FieldType/fileImage';
import InputType from './FieldType/input';
import InputMultilineType from './FieldType/inputMultiline';
import ListType from './FieldType/list';
import ListO2mType from './FieldType/listO2m';
import ListO2oType from './FieldType/listO2o';
import SelectDropdownType from './FieldType/selectDropdown';
import SelectDropdownM2oType from './FieldType/selectDropdownM2o';
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
          <InputType
            slug={slug}
            expanded={fieldInterface === 'input'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onSuccess={onSuccess}
          />
          <InputMultilineType
            slug={slug}
            expanded={fieldInterface === 'inputMultiline'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onSuccess={onSuccess}
          />
          <SelectDropdownType
            slug={slug}
            expanded={fieldInterface === 'selectDropdown'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onSuccess={onSuccess}
          />
          <DateTimeType
            slug={slug}
            expanded={fieldInterface === 'dateTime'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onSuccess={onSuccess}
          />
          <FileType
            slug={slug}
            expanded={fieldInterface === 'file'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onSuccess={onSuccess}
          />
          <FileImageType
            slug={slug}
            expanded={fieldInterface === 'fileImage'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onSuccess={onSuccess}
          />
          <ListType
            slug={slug}
            expanded={fieldInterface === 'list'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onSuccess={onSuccess}
          />
          <ListO2oType
            slug={slug}
            expanded={fieldInterface === 'listO2o'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onSuccess={onSuccess}
          />
          <ListO2mType
            slug={slug}
            expanded={fieldInterface === 'listO2m'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onSuccess={onSuccess}
          />
          <SelectDropdownM2oType
            slug={slug}
            expanded={fieldInterface === 'selectDropdownM2o'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onSuccess={onSuccess}
          />
        </Box>
      </Drawer>
    </Box>
  );
};

export default ComposeWrapper({ context: FieldContextProvider })(CreateField);
