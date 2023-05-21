import { CloseOutlined } from '@mui/icons-material';
import { Box, Drawer, IconButton, Stack, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FieldInterface } from '../../../../../config/types.js';
import { UnsavedDialog } from '../../../../components/elements/UnsavedDialog/index.js';
import { ComposeWrapper } from '../../../../components/utilities/ComposeWrapper/index.js';
import { FieldContextProvider } from './Context/index.js';
import { BooleanType } from './fieldTypes/Boolean/index.js';
import { DateTimeType } from './fieldTypes/DateTime/index.js';
import { FileImageType } from './fieldTypes/FileImage/index.js';
import { InputType } from './fieldTypes/Input/index.js';
import { InputMultilineType } from './fieldTypes/InputMultiline/index.js';
import { InputRichTextMdType } from './fieldTypes/InputRichTextMd/index.js';
import { SelectDropdownType } from './fieldTypes/SelectDropdown/index.js';
import { Props } from './types.js';

const CreateFieldImpl: React.FC<Props> = ({ collection, openState, onSuccess, onClose }) => {
  const [fieldInterface, setFieldInterface] = useState<FieldInterface | null>(null);
  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const [editing, setEditing] = useState(false);
  const [openUnsavedDialog, setOpenUnsavedDialog] = useState(false);
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

    onDrawerClose();
  };

  const onDrawerClose = () => {
    editing ? setOpenUnsavedDialog(true) : onClose();
  };

  // /////////////////////////////////////
  // Add field interface
  // /////////////////////////////////////

  // Choose to continue editing on the discard of a field edit.
  const handleKeepEditing = () => {
    setOpenUnsavedDialog(false);
  };

  // Choose to discard changes on the discard of a field edit.
  const handleDiscardChanges = () => {
    setOpenUnsavedDialog(false);
    setEditing(false);
    onClose();
  };

  const handleEditing = (unsaved: boolean) => {
    setEditing(unsaved);
  };

  const handleAdditionSuccess = (field: Field) => {
    setEditing(false);
    onSuccess(field);
  };

  const onSelectedFieldInterface = (field: FieldInterface) => {
    fieldInterface === field ? setFieldInterface(null) : setFieldInterface(field);
  };

  const onChangeParentViewInvisible = (state: boolean) => {
    setDrawerVisibility(state);
  };

  return (
    <Box>
      <UnsavedDialog
        open={openUnsavedDialog}
        onConfirm={handleDiscardChanges}
        onClose={handleKeepEditing}
      />
      <Drawer
        anchor="right"
        open={openState}
        onClose={onToggle()}
        sx={{ zIndex: theme.zIndex.appBar + 200 }}
      >
        <Box sx={{ overflowY: 'scroll', maxWidth: 660 }} hidden={drawerVisibility}>
          <Stack direction="row" columnGap={2} sx={{ p: 1 }}>
            <IconButton aria-label="close" onClick={onDrawerClose}>
              <CloseOutlined />
            </IconButton>
            <Box display="flex" alignItems="center">
              <Typography variant="h6">{t('select_field_type')}</Typography>
            </Box>
          </Stack>
          <InputType
            collection={collection}
            expanded={fieldInterface === 'input'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onEditing={handleEditing}
            onSuccess={handleAdditionSuccess}
          />
          <InputMultilineType
            collection={collection}
            expanded={fieldInterface === 'inputMultiline'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onEditing={handleEditing}
            onSuccess={handleAdditionSuccess}
          />
          <InputRichTextMdType
            collection={collection}
            expanded={fieldInterface === 'inputRichTextMd'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onEditing={handleEditing}
            onSuccess={handleAdditionSuccess}
          />
          <SelectDropdownType
            collection={collection}
            expanded={fieldInterface === 'selectDropdown'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onEditing={handleEditing}
            onSuccess={handleAdditionSuccess}
            onChangeParentViewInvisible={onChangeParentViewInvisible}
          />
          <DateTimeType
            collection={collection}
            expanded={fieldInterface === 'dateTime'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onEditing={handleEditing}
            onSuccess={handleAdditionSuccess}
          />
          <BooleanType
            collection={collection}
            expanded={fieldInterface === 'boolean'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onEditing={handleEditing}
            onSuccess={handleAdditionSuccess}
          />
          <FileImageType
            collection={collection}
            expanded={fieldInterface === 'fileImage'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onEditing={handleEditing}
            onSuccess={handleAdditionSuccess}
          />
          {/*
          <FileType
            collection={collection}
            expanded={fieldInterface === 'file'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onEditing={handleEditing}
            onSuccess={handleAdditionSuccess}
          />
          <ListType
            collection={collection}
            expanded={fieldInterface === 'list'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onEditing={handleEditing}
            onSuccess={handleAdditionSuccess}
          />
          <ListO2oType
            collection={collection}
            expanded={fieldInterface === 'listO2o'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onEditing={handleEditing}
            onSuccess={handleAdditionSuccess}
          />
          <ListO2mType
            collection={collection}
            expanded={fieldInterface === 'listO2m'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onEditing={handleEditing}
            onSuccess={handleAdditionSuccess}
          />
          <SelectDropdownM2oType
            collection={collection}
            expanded={fieldInterface === 'selectDropdownM2o'}
            handleChange={(field) => onSelectedFieldInterface(field)}
            onEditing={handleEditing}
            onSuccess={handleAdditionSuccess}
          /> */}
        </Box>
      </Drawer>
    </Box>
  );
};

export const CreateField = ComposeWrapper({ context: FieldContextProvider })(CreateFieldImpl);
