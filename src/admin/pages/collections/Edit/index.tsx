import RouterLink from '@admin/components/elements/Link';
import { useAuth } from '@admin/components/utilities/Auth';
import { BoxProps, Box, Button } from '@mui/material';
import { t } from 'i18next';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Props } from './types';

const Item = (props: BoxProps) => {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        alignItems: 'center',
        ...sx,
      }}
      {...other}
    />
  );
};

const EditPage: React.FC<Props> = ({ collection }) => {
  const { id } = useParams();
  const { hasPermission } = useAuth();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Item>
          <h1>
            {id ? 'Update' : 'Create'} {collection.collection}
          </h1>
        </Item>
        <Item>
          <Button
            variant="contained"
            disabled={!hasPermission(collection.collection, id ? 'update' : 'create')}
            component={RouterLink}
            to="create"
          >
            {id ? t('button.update') : t('button.create')}
          </Button>
        </Item>
      </Box>
      {}
    </>
  );
};

export default EditPage;
