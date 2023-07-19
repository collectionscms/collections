import { CloseOutlined } from '@ant-design/icons';
import { Box, Button, Divider, Drawer, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { IconButton } from 'superfast-ui';
import { referencedTypes } from '../../../../../../server/database/schemas.js';
import {
  ContentContextProvider,
  useContent,
} from '../../../../../pages/collections/Context/index.js';
import { buildColumnFields } from '../../../../../pages/collections/List/buildColumnFields.js';
import { buildColumns } from '../../../../../utilities/buildColumns.js';
import { ScrollBar } from '../../../../elements/ScrollBar/index.js';
import { RadioGroupTable } from '../../../../elements/Table/RadioGroupTable/index.js';
import { Column } from '../../../../elements/Table/types.js';
import { ComposeWrapper } from '../../../../utilities/ComposeWrapper/index.js';
import { Props } from './types.js';

const AddExistContentsImpl: React.FC<Props> = ({
  collection,
  field,
  openState,
  onSuccess,
  onClose,
}) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedContent, setSelectedContent] = useState<any>(null);

  const { getRelations, getContents, getFields } = useContent();
  const { data: relations } = getRelations(collection, field);
  const relationFetched = (relations && relations[0] !== null) || false;

  const { data: fields } = getFields(relations ? relations[0].one_collection : '', relationFetched);

  const { data: content } = getContents(
    relations ? relations[0].one_collection : '',
    relationFetched
  );
  // Convert to array in case of singleton.
  const contents = content && !Array.isArray(content) ? [content] : content;

  useEffect(() => {
    if (fields === undefined) return;
    // excludes referenced fields.
    const filtered = fields.filter((field) => !referencedTypes.includes(field.interface));
    const columnFields = buildColumnFields(filtered);
    const columns = buildColumns(columnFields);
    setColumns(columns);
  }, [fields]);

  const handleSelect = (row: any) => {
    setSelectedContent(row);
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
    onSuccess(selectedContent);
    setSelectedContent(null);
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
          <Stack rowGap={3} sx={{ p: 3 }}>
            <RadioGroupTable columns={columns} rows={contents || []} onChange={handleSelect} />
          </Stack>
          <Stack sx={{ px: 3 }}>
            <Button
              variant="contained"
              onClick={onSelected}
              disabled={selectedContent === null}
              size="large"
              fullWidth
            >
              {t('decide')}
            </Button>
          </Stack>
        </ScrollBar>
      </Drawer>
    </Stack>
  );
};

export const AddExistContents = ComposeWrapper({ context: ContentContextProvider })(
  AddExistContentsImpl
);
