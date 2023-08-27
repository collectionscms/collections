import { CloseOutlined } from '@ant-design/icons';
import { Box, Button, Divider, Drawer, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { IconButton } from 'superfast-ui';
import { referencedTypes } from '../../../../../../api/database/schemas.js';
import {
  ContentContextProvider,
  useContent,
} from '../../../../../pages/collections/Context/index.js';
import { buildColumnFields } from '../../../../../pages/collections/List/buildColumnFields.js';
import { buildColumns } from '../../../../../utilities/buildColumns.js';
import { ScrollBar } from '../../../../elements/ScrollBar/index.js';
import { CheckBoxTable } from '../../../../elements/Table/CheckBoxTable/index.js';
import { Column } from '../../../../elements/Table/types.js';
import { ComposeWrapper } from '../../../../utilities/ComposeWrapper/index.js';
import { Props } from './types.js';

const AddExistContentsImpl: React.FC<Props> = ({
  collection,
  field,
  excludes,
  openState,
  onSuccess,
  onClose,
}) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedContentIds, setSelectedContentIds] = useState<number[]>([]);

  const { getRelations, getContents, getFields, getCollections } = useContent();

  const relation = getRelations(collection, field).data?.[0];
  const relationFetched = relation !== undefined || false;

  const relatedCollection = getCollections(relation?.many_collection || null).data?.[0];
  const fields = getFields(relation ? relation.many_collection : '', relationFetched).data;
  const content = getContents(relation ? relation.many_collection : '', relationFetched).data;

  // Convert to array in case of singleton.
  const contents: any[] = content && !Array.isArray(content) ? [content] : content;

  useEffect(() => {
    if (relatedCollection === undefined || fields === undefined) return;
    // excludes referenced fields.
    const filtered = fields.filter((field) => !referencedTypes.includes(field.interface));
    const columnFields = buildColumnFields(relatedCollection, filtered);
    const columns = buildColumns(columnFields);
    setColumns(columns);
  }, [relatedCollection, fields]);

  const excludedContents = contents
    ? contents.filter((content) => !excludes.some((data) => data.id === content.id))
    : [];

  const handleCheck = (row: any, checked: boolean) => {
    if (checked) {
      setSelectedContentIds([...selectedContentIds, row.id]);
    } else {
      const filtered = selectedContentIds.filter((contentId) => contentId !== row.id);
      setSelectedContentIds(filtered);
    }
  };

  const onToggle = () => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    onClose();
  };

  const onSelected = () => {
    const selectedContents = contents?.filter((content) => selectedContentIds.includes(content.id));
    onSuccess(selectedContents || []);
    setSelectedContentIds([]);
  };

  return (
    <Stack>
      <Drawer
        anchor="right"
        open={openState}
        onClose={onToggle()}
        PaperProps={{
          sx: {
            width: { xs: 340, md: 660 },
          },
        }}
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
              <Typography variant="h4">{t('select_contents')}</Typography>
              <IconButton
                color="secondary"
                size="small"
                sx={{ fontSize: '0.875rem' }}
                onClick={onClose}
              >
                <CloseOutlined />
              </IconButton>
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ p: 3 }}>
            <Stack rowGap={3}>
              <CheckBoxTable columns={columns} rows={excludedContents} onChange={handleCheck} />
              <Button
                variant="contained"
                onClick={onSelected}
                disabled={selectedContentIds.length === 0}
                size="large"
                fullWidth
              >
                {t('decide')}
              </Button>
            </Stack>
          </Box>
        </ScrollBar>
      </Drawer>
    </Stack>
  );
};

export const AddExistContents = ComposeWrapper({ context: ContentContextProvider })(
  AddExistContentsImpl
);
