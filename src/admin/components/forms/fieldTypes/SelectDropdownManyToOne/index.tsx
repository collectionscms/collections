import { Box, Button } from '@mui/material';
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

  const handleSelectedContent = (content: Partial<{ id: number }>) => {
    setAddRelationsOpen(false);
    setValue(meta.field, content.id);
  };

  return (
    <>
      <AddExistContents
        collection={meta.collection}
        field={meta.field}
        openState={addRelationsOpen}
        onSuccess={(content) => handleSelectedContent(content)}
        onClose={() => onToggleAddRelations(false)}
      />
      {watch(meta.field) && <Box key={watch(meta.field)}>{watch(meta.field)}</Box>}
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
