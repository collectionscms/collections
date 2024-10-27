import { Box, Drawer, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { ContentRevision } from '@prisma/client';
import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SimpleBar from 'simplebar-react';
import { RevisedContent } from '../../../../../../types/index.js';
import { logger } from '../../../../../../utilities/logger.js';
import { Avatar } from '../../../../../@extended/components/Avatar/index.js';
import { IconButton } from '../../../../../@extended/components/IconButton/index.js';
import { MainCard } from '../../../../../@extended/components/MainCard/index.js';
import { Icon } from '../../../../../components/elements/Icon/index.js';
import { ModalDialog } from '../../../../../components/elements/ModalDialog/index.js';
import { usePost } from '../../../Context/index.js';

export type Props = {
  content: RevisedContent;
  onReverted: () => void;
};

export const Revision: React.FC<Props> = ({ content, onReverted }) => {
  const { id, revisions } = content;

  const theme = useTheme();
  const { t } = useTranslation();

  const [openRevert, setOpenRevert] = useState(false);
  const [revertRevision, setRevertRevision] = useState<ContentRevision | null>(null);
  const toggleRevertMode = (revision: ContentRevision) => {
    setOpenRevert(!openRevert);
    setRevertRevision(revision);
  };

  const { revertContent } = usePost();
  const { trigger: revertContentTrigger } = revertContent(id);

  const handleRevert = async () => {
    if (!revertRevision) return;

    try {
      await revertContentTrigger({
        contentRevisionId: revertRevision.id,
      });
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

  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <ModalDialog
        open={openRevert}
        title={t('dialog.confirm_revert_previous_version_title')}
        body={t('dialog.confirm_revert_previous_version', { version: revertRevision?.version })}
        execute={{ label: t('revert'), action: handleRevert }}
        cancel={{ label: t('cancel'), action: () => setOpenRevert(false) }}
      />
      <Tooltip title={t('version_history')} placement="top-start">
        <IconButton
          color="secondary"
          shape="rounded"
          variant="contained"
          sx={{
            color: 'text.primary',
            backgroundColor: theme.palette.grey[200],
            '&:hover': { backgroundColor: theme.palette.grey[300] },
          }}
          onClick={handleToggle}
        >
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
                <Icon name="X" size={18} />
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
                  {revisions.map((revision) => (
                    <Stack key={revision.id} flexDirection="row" gap={2}>
                      <Avatar variant="rounded" size="md" color="secondary" type="filled">
                        <Typography variant="h5">v{revision.version}</Typography>
                      </Avatar>
                      <Stack
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                      >
                        <Stack>
                          <Typography variant="h6" component="span">
                            {t(`${revision.status}` as unknown as TemplateStringsArray)}
                          </Typography>
                          <Typography color="textSecondary" variant="subtitle2">
                            {dayjs(revision.createdAt).format(t('date_format.long'))}
                          </Typography>
                        </Stack>
                        {content.version !== revision.version &&
                          revision.status === 'published' && (
                            <Tooltip
                              title={t('revert_to', { version: revision.version })}
                              placement="right"
                            >
                              <IconButton
                                color="secondary"
                                onClick={() => toggleRevertMode(revision)}
                              >
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
