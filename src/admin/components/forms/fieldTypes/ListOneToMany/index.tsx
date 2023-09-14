import { CloseCircleOutlined } from '@ant-design/icons';
import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'superfast-ui';
import { ContentContextProvider } from '../../../../pages/collections/Context/index.js';
import { ComposeWrapper } from '../../../utilities/ComposeWrapper/index.js';
import { Props } from '../types.js';
import { AddExistContents } from './AddExistContents/index.js';

export const ListOneToManyTypeImpl: React.FC<Props> = ({
  form: { register, setValue, watch },
  field: meta,
}) => {
  const [addRelationsOpen, setAddRelationsOpen] = useState(false);

  const { t } = useTranslation();
  const required = meta.required && { required: t('yup.mixed.required') };

  const onToggleAddRelations = (state: boolean) => {
    setAddRelationsOpen(state);
  };

  const handleSelectContents = (contents: Partial<{ id: number }>[]) => {
    setAddRelationsOpen(false);
    const selectedContents = (watch(meta.field) as Partial<{ id: number }>[]) || [];
    selectedContents.push(...contents);
    setValue(meta.field, selectedContents);
  };

  const removeSelectedContent = (contentId: number) => {
    const selectedContents = watch(meta.field) as Partial<{ id: number }>[];
    const filtered = selectedContents.filter((content) => content.id !== contentId);
    setValue(meta.field, filtered);
  };

  return (
    <>
      <AddExistContents
        collectionId={meta.collection_id.toString()}
        field={meta.field}
        excludes={watch(meta.field) || []}
        openState={addRelationsOpen}
        onSuccess={(contents) => handleSelectContents(contents)}
        onClose={() => onToggleAddRelations(false)}
      />
      {watch(meta.field) &&
        watch(meta.field).map((data: any) => (
          <Box key={data.id} display="flex" alignItems="center">
            {data.id}
            <IconButton color="secondary" onClick={() => removeSelectedContent(data.id)}>
              <CloseCircleOutlined />
            </IconButton>
          </Box>
        ))}
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

export const ListOneToManyType = ComposeWrapper({ context: ContentContextProvider })(
  ListOneToManyTypeImpl
);
