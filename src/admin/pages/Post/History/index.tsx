import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from '@mui/lab';
import { Popover, Tooltip, Typography } from '@mui/material';
import { ContentHistory } from '@prisma/client';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import { Icon } from '../../../components/elements/Icon/index.js';

type Props = {
  histories: ContentHistory[];
};

export const History: React.FC<Props> = ({ histories }) => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [openHistory, setOpenHistory] = useState(false);

  const handleOpenHistory = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenHistory(true);
  };

  const handleCloseEditor = () => {
    setAnchorEl(null);
    setOpenHistory(false);
  };

  const getTimelineDotColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'review':
        return 'warning';
      case 'published':
        return 'success';
      case 'archived':
        return 'error';
    }
  };

  return (
    <>
      <Popover
        open={openHistory}
        anchorEl={anchorEl}
        onClose={handleCloseEditor}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        sx={{ transform: 'translate(0px, -12px)' }}
      >
        <Timeline
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {histories.map((history) => (
            <TimelineItem key={history.id}>
              <TimelineSeparator>
                <TimelineDot
                  variant="filled"
                  color={getTimelineDotColor(history.status)}
                  sx={{ padding: 0.4, borderWidth: 1 }}
                />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6" component="span">
                  {t(`${history.status}` as unknown as TemplateStringsArray)}
                  {history.status === 'published' && ` V${history.version}`}
                </Typography>
                <Typography color="textSecondary" variant="subtitle2">
                  {dayjs(history.createdAt).format(t('date_format.long'))}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Popover>
      <Tooltip title={t('history')} placement="top-start">
        <span>
          <IconButton
            shape="rounded"
            color="secondary"
            onClick={handleOpenHistory}
            disabled={histories.length === 0}
          >
            <Icon name="History" size={18} />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
