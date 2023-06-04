import { Cancel } from '@mui/icons-material';
import { Box, Button, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContentContextProvider } from '../../../../pages/collections/Context/index.js';
import { ComposeWrapper } from '../../../utilities/ComposeWrapper/index.js';
import { Props } from '../types.js';
import { AddExistContents } from './AddExistContents/index.js';

export const SelectDropdownManyToOneTypeImpl: React.FC<Props> = ({
  form: { register, setValue, watch },
  field: meta,
}) => {
  const [addRelationsOpen, setAddRelationsOpen] = useState(false);

  const { t } = useTranslation();
  const required = meta.required && { required: t('yup.mixed.required') };

  const onToggleAddRelations = (state: boolean) => {
    setAddRelationsOpen(state);
  };

  const handleSelectContent = (content: Partial<{ id: number }>) => {
    setAddRelationsOpen(false);
    setValue(meta.field, content.id);
  };

  const removeSelectedContent = () => {
    setValue(meta.field, null);
  };

  return (
    <>
      <AddExistContents
        collection={meta.collection}
        field={meta.field}
        openState={addRelationsOpen}
        onSuccess={(content) => handleSelectContent(content)}
        onClose={() => onToggleAddRelations(false)}
      />
      {watch(meta.field) && (
        <Box key={watch(meta.field)} display="flex" alignItems="center">
          {watch(meta.field)}
          <IconButton onClick={() => removeSelectedContent()}>
            <Cancel />
          </IconButton>
        </Box>
      )}
      <Button
        variant="contained"
        onClick={() => onToggleAddRelations(true)}
        size="large"
        sx={{ mt: 2 }}
      >
        {t('add')}
      </Button>
      <input hidden {...register(meta.field, { ...required })} />
    </>
  );
};

export const SelectDropdownManyToOneType = ComposeWrapper({ context: ContentContextProvider })(
  SelectDropdownManyToOneTypeImpl
);
