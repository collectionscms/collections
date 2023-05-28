import { Box, Button } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

  const handleSelectedContents = (contents: Partial<{ id: number }>[]) => {
    setAddRelationsOpen(false);
    setValue(meta.field, contents);
  };

  return (
    <>
      <AddExistContents
        collection={meta.collection}
        field={meta.field}
        openState={addRelationsOpen}
        onSuccess={(contents) => handleSelectedContents(contents)}
        onClose={() => onToggleAddRelations(false)}
      />
      {watch(meta.field) &&
        watch(meta.field).map((data: any) => <Box key={data.id}>{data.id}</Box>)}
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
