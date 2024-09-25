import { Box, Drawer, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SimpleBar from 'simplebar-react';
import { LocalizedPost } from '../../../../../../types/index.js';
import { logger } from '../../../../../../utilities/logger.js';
import { Avatar } from '../../../../../@extended/components/Avatar/index.js';
import { IconButton } from '../../../../../@extended/components/IconButton/index.js';
import { MainCard } from '../../../../../@extended/components/MainCard/index.js';
import { Icon } from '../../../../../components/elements/Icon/index.js';
import { ModalDialog } from '../../../../../components/elements/ModalDialog/index.js';
import { usePost } from '../../../Context/index.js';

export type Props = {
  post: LocalizedPost;
  onReverted: () => void;
};

export const History: React.FC<Props> = ({ post, onReverted }) => {
  const { contentId, revisions: revisions, version, status } = post;

  const theme = useTheme();
  const { t } = useTranslation();
  const [openRevert, setOpenRevert] = useState(false);

  const { trashContent } = usePost();
  const { trigger: trashContentTrigger } = trashContent(contentId);

  const handleRevert = async () => {
    try {
      await trashContentTrigger();
      onReverted();
      enqueueSnackbar(t('toast.post_reverted'), {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
      setOpenRevert(false);
    } catch (error) {
      logger.error(error);
    }
  };

  const sortedRevisions = revisions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <ModalDialog
        open={openRevert}
        title={t('dialog.confirm_revert_previous_version_title')}
        body={t('dialog.confirm_revert_previous_version')}
        execute={{ label: t('restore'), action: handleRevert }}
        cancel={{ label: t('cancel'), action: () => setOpenRevert(false) }}
      />
      <Tooltip title={t('version_history')} placement="top-start">
        <IconButton color="secondary" shape="rounded" variant="outlined" onClick={handleToggle}>
          <Icon strokeWidth={2} name="History" />
        </IconButton>
      </Tooltip>
      <Drawer
        sx={{
          zIndex: 1300,
        }}
        anchor="left"
        variant="temporary"
        onClose={handleToggle}
        open={open}
        PaperProps={{
          sx: {
            width: 340,
          },
        }}
      >
        {open && (
          <MainCard
            title={t('version_history')}
            sx={{
              border: 'none',
              borderRadius: 0,
              height: '100vh',
              '& .MuiCardHeader-root': {
                '& .MuiTypography-root': { fontSize: '1rem' },
              },
            }}
            content={false}
            secondary={
              <IconButton size="small" color="secondary" onClick={handleToggle}>
                <Icon name="X" size={16} />
              </IconButton>
            }
          >
            <SimpleBar>
              <Box
                sx={{
                  height: 'calc(100vh - 64px)',
                  '& .MuiAccordion-root': {
                    borderColor: theme.palette.divider,
                    '& .MuiAccordionSummary-root': {
                      bgcolor: 'transparent',
                      flexDirection: 'row',
                      pl: 1,
                    },
                    '& .MuiAccordionDetails-root': {
                      border: 'none',
                    },
                    '& .Mui-expanded': {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <Stack sx={{ p: 2 }} gap={2}>
                  {sortedRevisions.map((history) => (
                    <Stack key={history.id} flexDirection="row" gap={2}>
                      <Avatar variant="rounded" size="md" color="secondary" type="filled">
                        <Typography variant="h5">v{history.version}</Typography>
                      </Avatar>
                      <Stack
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                      >
                        <Stack>
                          <Typography variant="h6" component="span">
                            {t(`${history.status}` as unknown as TemplateStringsArray)}
                          </Typography>
                          <Typography color="textSecondary" variant="subtitle2">
                            {dayjs(history.createdAt).format(t('date_format.long'))}
                          </Typography>
                        </Stack>
                        {status.currentStatus === 'draft' && version - 1 === history.version && (
                          <Tooltip title={t('restore')}>
                            <IconButton color="secondary" onClick={() => setOpenRevert(true)}>
                              <Icon name="Undo2" size={14} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </SimpleBar>
          </MainCard>
        )}
      </Drawer>
    </>
  );
};
