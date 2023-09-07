import { DownloadOutlined } from '@ant-design/icons';
import { Button, Stack } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MainCard } from 'superfast-ui';
import { CreateNewButton } from '../../components/elements/CreateNewButton/index.js';
import { ImportFile } from '../../components/elements/ImportFileDialog/index.js';
import { Link } from '../../components/elements/Link/index.js';
import { Cell } from '../../components/elements/Table/Cell/index.js';
import { cells } from '../../components/elements/Table/Cell/types.js';
import { Table } from '../../components/elements/Table/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { useConfig } from '../../components/utilities/Config/index.js';
import { Collection } from '../../config/types.js';
import { buildColumns } from '../../utilities/buildColumns.js';
import { CollectionContextProvider, useCollection } from './Context/index.js';

const ContentTypePageImpl: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const config = useConfig();
  const { getCollections } = useCollection();
  const { data } = getCollections();

  const showDialog = () => {
    setOpen(true);
  };

  const handleDialog = (success: boolean) => {
    setOpen(!open);
    if (success) {
      config.revalidateCollections();
    }
  };

  const fields = [{ field: 'collection', label: t('name'), type: cells.text() }];

  const columns = buildColumns(fields, (i: number, row: Collection, data: any) => {
    const cell = <Cell colIndex={i} type={fields[i].type} cellData={data} />;
    return i === 0 ? <Link href={`${row.id}`}>{cell}</Link> : cell;
  });

  const buttons = (
    <>
      <ImportFile
        open={open}
        onSuccess={() => handleDialog(true)}
        onClose={() => handleDialog(false)}
      />
      <Stack direction="row" justifyContent="space-around" alignItems="center" gap={2}>
        <Stack alignItems="center">
          <Button
            onClick={showDialog}
            startIcon={<DownloadOutlined style={{ fontSize: '10px' }} />}
            size="small"
            variant="contained"
          >
            {t('import')}
          </Button>
        </Stack>
        <Stack alignItems="center">
          <CreateNewButton to="create" />
        </Stack>
      </Stack>
    </>
  );

  return (
    <MainCard content={false} title={<></>} secondary={buttons}>
      {data !== undefined && <Table columns={columns} rows={data} />}
    </MainCard>
  );
};

export const ContentTypePage = ComposeWrapper({ context: CollectionContextProvider })(
  ContentTypePageImpl
);
