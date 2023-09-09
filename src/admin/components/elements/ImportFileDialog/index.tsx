import { CloseOutlined } from '@ant-design/icons';
import { Dialog, DialogContent, DialogTitle, Grid, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'superfast-ui';
import { logger } from '../../../../utilities/logger.js';
import { ComposeWrapper } from '../../utilities/ComposeWrapper/index.js';
import { SingleFileUpload } from '../SingleFileUpload/index.js';
import { CustomFile } from '../SingleFileUpload/types.js';
import { ImportFileContextProvider, useImportFile } from './Context/index.js';
import { Props } from './types.js';

const ImportFileImpl: React.FC<Props> = ({ open, onSuccess, onClose }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { importWordPressXml } = useImportFile();
  const { trigger } = importWordPressXml();

  const handleClose = () => {
    onClose();
  };

  const handleSetFiles = async (files: CustomFile[] | null) => {
    const file = files?.[0];
    if (!file) return;

    const params = new FormData();
    params.append('file', file);

    try {
      await trigger(params);
      enqueueSnackbar(t('toast.imported_successfully'), { variant: 'success' });
      onSuccess();
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth={true}>
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{ borderBottom: '1px solid {theme.palette.divider}' }}
      >
        <Grid item>
          <DialogTitle>{t('import_from_wordpress_xml')}</DialogTitle>
        </Grid>
        <Grid item sx={{ mr: 1.5 }}>
          <IconButton color="secondary" onClick={handleClose}>
            <CloseOutlined />
          </IconButton>
        </Grid>
      </Grid>
      <DialogContent>
        <Stack spacing={1.5} alignItems="center">
          <SingleFileUpload accept={{ 'text/xml': ['.xml'] }} onSetFiles={handleSetFiles} />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export const ImportFile = ComposeWrapper({ context: ImportFileContextProvider })(ImportFileImpl);
