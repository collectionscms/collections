import { CloseOutlined } from '@ant-design/icons';
import { Box, Divider, Drawer, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'superfast-ui';
import { Field } from '../../../../../config/types.js';
import { BaseDialog } from '../../../../components/elements/BaseDialog/index.js';
import { ScrollBar } from '../../../../components/elements/ScrollBar/index.js';
import { ComposeWrapper } from '../../../../components/utilities/ComposeWrapper/index.js';
import { FieldContextProvider } from './Context/index.js';
import { BooleanType } from './fieldTypes/Boolean/index.js';
import { DateTimeType } from './fieldTypes/DateTime/index.js';
import { FileImageType } from './fieldTypes/FileImage/index.js';
import { InputType } from './fieldTypes/Input/index.js';
import { InputMultilineType } from './fieldTypes/InputMultiline/index.js';
import { InputRichTextMdType } from './fieldTypes/InputRichTextMd/input.js';
import { ListOneToManyType } from './fieldTypes/ListOneToMany/index.js';
import { SelectDropdownType } from './fieldTypes/SelectDropdown/index.js';
import { SelectDropdownManyToOneType } from './fieldTypes/SelectDropdownManyToOne/index.js';
import { Props } from './types.js';

const EditFieldImpl: React.FC<Props> = ({ field, open, onSuccess, onClose }) => {
  const [openUnsavedDialog, setOpenUnsavedDialog] = useState(false);
  const [drawerVisibility, setDrawerVisibility] = useState(false);
  const [editing, setEditing] = useState(false);
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

  const handleChangeParentViewInvisible = (state: boolean) => {
    setDrawerVisibility(state);
  };

  const onDrawerClose = () => {
    editing ? setOpenUnsavedDialog(true) : onClose();
  };

  // /////////////////////////////////////
  // Edit field interface
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

  const handleEditedSuccess = (field: Field) => {
    setEditing(false);
    onSuccess(field);
  };

  return (
    <Box>
      <BaseDialog
        open={openUnsavedDialog}
        title={t('dialog.unsaved_changes_title')}
        body={t('dialog.unsaved_changes')}
        confirm={{ label: t('dialog.discard_changes'), action: handleDiscardChanges }}
        cancel={{ label: t('dialog.keep_editing'), action: handleKeepEditing }}
      />
      <Drawer
        anchor="right"
        open={open}
        onClose={onToggle()}
        PaperProps={{
          sx: {
            width: { xs: 340, md: 660 },
          },
        }}
        hidden={drawerVisibility}
      >
        <ScrollBar
          sx={{
            '& .simplebar-content': {
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h4">{t('edit_field')}</Typography>
              <IconButton
                color="secondary"
                size="small"
                sx={{ fontSize: '0.875rem' }}
                onClick={onDrawerClose}
              >
                <CloseOutlined />
              </IconButton>
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ p: 3 }}>
            {field.interface === 'input' && (
              <InputType field={field} onEditing={handleEditing} onSuccess={handleEditedSuccess} />
            )}
            {field.interface === 'inputMultiline' && (
              <InputMultilineType
                field={field}
                onEditing={handleEditing}
                onSuccess={handleEditedSuccess}
              />
            )}
            {field.interface === 'inputRichTextMd' && (
              <InputRichTextMdType
                field={field}
                onEditing={handleEditing}
                onSuccess={handleEditedSuccess}
              />
            )}
            {(field.interface === 'selectDropdown' ||
              field.interface === 'selectDropdownStatus') && (
              <SelectDropdownType
                field={field}
                onEditing={handleEditing}
                onSuccess={handleEditedSuccess}
                onChangeParentViewInvisible={handleChangeParentViewInvisible}
              />
            )}
            {field.interface === 'boolean' && (
              <BooleanType
                field={field}
                onEditing={handleEditing}
                onSuccess={handleEditedSuccess}
              />
            )}
            {field.interface === 'dateTime' && (
              <DateTimeType
                field={field}
                onEditing={handleEditing}
                onSuccess={handleEditedSuccess}
              />
            )}
            {field.interface === 'fileImage' && (
              <FileImageType
                field={field}
                onEditing={handleEditing}
                onSuccess={handleEditedSuccess}
              />
            )}
            {field.interface === 'listOneToMany' && (
              <ListOneToManyType
                field={field}
                onEditing={handleEditing}
                onSuccess={handleEditedSuccess}
              />
            )}
            {field.interface === 'selectDropdownManyToOne' && (
              <SelectDropdownManyToOneType
                field={field}
                onEditing={handleEditing}
                onSuccess={handleEditedSuccess}
              />
            )}
          </Box>
        </ScrollBar>
      </Drawer>
    </Box>
  );
};

export const EditField = ComposeWrapper({ context: FieldContextProvider })(EditFieldImpl);
