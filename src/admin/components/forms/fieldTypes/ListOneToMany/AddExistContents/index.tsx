import { CloseOutlined } from '@mui/icons-material';
import { Box, Button, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { referencedTypes } from '../../../../../../server/database/schemas.js';
import {
  ContentContextProvider,
  useContent,
} from '../../../../../pages/collections/Context/index.js';
import { buildColumnFields } from '../../../../../pages/collections/List/buildColumnFields.js';
import { theme } from '../../../../../themes/Default/index.js';
import { buildColumns } from '../../../../../utilities/buildColumns.js';
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

  const { getRelations, getContents, getFields } = useContent();
  const { data: relations } = getRelations(collection, field);
  const relationFetched = (relations && relations[0] !== null) || false;

  const { data: fields } = getFields(
    relations ? relations[0].many_collection : '',
    relationFetched
  );

  const { data: content } = getContents(
    relations ? relations[0].many_collection : '',
    relationFetched
  );
  // Convert to array in case of singleton.
  const contents: any[] = content && !Array.isArray(content) ? [content] : content;

  useEffect(() => {
    if (fields === undefined) return;
    // excludes referenced fields.
    const filtered = fields.filter((field) => !referencedTypes.includes(field.interface));
    const columnFields = buildColumnFields(filtered);
    const columns = buildColumns(columnFields);
    setColumns(columns);
  }, [fields]);

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
        sx={{ zIndex: theme.zIndex.appBar + 200 }}
      >
        <Box sx={{ width: 660 }}>
          <Stack direction="row" columnGap={2} sx={{ p: 1 }}>
            <IconButton aria-label="close" onClick={onClose}>
              <CloseOutlined />
            </IconButton>
            <Box display="flex" alignItems="center">
              <Typography variant="h6">{t('select_contents')}</Typography>
            </Box>
          </Stack>
          <Stack rowGap={3} sx={{ p: 2 }}>
            <CheckBoxTable columns={columns} rows={excludedContents} onChange={handleCheck} />
          </Stack>
          <Stack sx={{ p: 2 }}>
            <Button
              variant="contained"
              onClick={onSelected}
              disabled={selectedContentIds.length === 0}
              size="large"
              fullWidth
            >
              {t('save')}
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </Stack>
  );
};

export const AddExistContents = ComposeWrapper({ context: ContentContextProvider })(
  AddExistContentsImpl
);
