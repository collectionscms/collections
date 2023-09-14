import { CloseCircleOutlined } from '@ant-design/icons';
import { Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'superfast-ui';
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

  const value = watch(meta.field);

  useEffect(() => {
    if (value === undefined) {
      initializeFieldAsNull();
    }
  }, [value]);

  const initializeFieldAsNull = () => {
    setValue(meta.field, null);
  };

  const onToggleAddRelations = (state: boolean) => {
    setAddRelationsOpen(state);
  };

  const handleSelectContent = (content: Partial<{ id: number }>) => {
    setAddRelationsOpen(false);
    setValue(meta.field, content.id);
  };

  return (
    <>
      <AddExistContents
        collectionId={meta.collection_id.toString()}
        field={meta.field}
        openState={addRelationsOpen}
        onSuccess={(content) => handleSelectContent(content)}
        onClose={() => onToggleAddRelations(false)}
      />
      {value && (
        <Box key={value} display="flex" alignItems="center">
          {value}
          <IconButton color="secondary" onClick={() => initializeFieldAsNull()}>
            <CloseCircleOutlined />
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
