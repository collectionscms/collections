import RouterLink from '@admin/components/elements/Link';
import Table from '@admin/components/elements/Table';
import Cell, { Type } from '@admin/components/elements/Table/Cell';
import buildColumns from '@admin/utilities/buildColumns';
import { Box, BoxProps, Button } from '@mui/material';
import React from 'react';
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

const Default: React.FC<Props> = ({ collection }) => {
  // TODO Retrieve from DB
  const fields = [{ field: 'name', label: 'Name', type: Type.Text }];

  const columns = buildColumns(fields, (i: number, row: any, data: any) => (
    <Cell colIndex={i} type={fields[i].type} rowData={row} cellData={data} />
  ));

  const rows = [
    {
      id: 1,
      name: 'collection1',
    },
    {
      id: 2,
      name: 'collection2',
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Item>
          <h1>{collection}</h1>
        </Item>
        <Item>
          <Button
            variant="contained"
            component={RouterLink}
            to={`/admin/collections/${collection}/create`}
          >
            登録
          </Button>
        </Item>
      </Box>
      <Table columns={columns} rows={rows} />
    </Box>
  );
};

export default Default;
