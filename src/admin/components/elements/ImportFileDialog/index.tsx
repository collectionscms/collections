import { CloseOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'superfast-ui';
import { logger } from '../../../../utilities/logger.js';
import { ComposeWrapper } from '../../utilities/ComposeWrapper/index.js';
import { ImportFileContextProvider, useImportFile } from './Context/index.js';
import { Props } from './types.js';

const ImportFileImpl: React.FC<Props> = ({ open, onSuccess, onClose }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { importWordPressXml } = useImportFile();
  const { trigger } = importWordPressXml();

  const handleClose = () => {
    onClose();
  };

  const handleSelectedFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
    <Dialog open={open} onClose={handleClose} maxWidth="xs">
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{ borderBottom: '1px solid {theme.palette.divider}' }}
      >
        <Grid item>
          <DialogTitle>{t('import_posts_from_wordpress_xml')}</DialogTitle>
        </Grid>
        <Grid item sx={{ mr: 1.5 }}>
          <IconButton color="secondary" onClick={handleClose}>
            <CloseOutlined />
          </IconButton>
        </Grid>
      </Grid>
      <DialogContent>
        <Box
          sx={{
            border: 1,
            borderStyle: 'dashed',
            borderColor: theme.palette.primary.main,
            borderRadius: '4px',
          }}
        >
          <Stack
            spacing={1}
            direction="column"
            sx={{ p: 8, alignItems: 'center', justifyContent: 'center' }}
          >
            <Typography variant="h5" align="center">
              {t('upload_xml_file')}
            </Typography>
            <Button
              variant="text"
              size="small"
              component="label"
              startIcon={<UploadOutlined style={{ fontSize: '16px' }} />}
            >
              <input hidden type="file" onChange={handleSelectedFile} />
              <Typography>{t('upload_file_manually')}</Typography>
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export const ImportFile = ComposeWrapper({ context: ImportFileContextProvider })(ImportFileImpl);
