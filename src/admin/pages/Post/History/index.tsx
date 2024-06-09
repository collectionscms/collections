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
import { RiHistoryLine } from '@remixicon/react';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../../../@extended/components/IconButton/index.js';

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
                {history.status === 'draft' && <TimelineDot variant="outlined" color="secondary" />}
                {history.status === 'review' && <TimelineDot variant="filled" color="warning" />}
                {history.status === 'published' && <TimelineDot variant="filled" color="success" />}
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6" component="span">
                  {t(`${history.status}` as unknown as TemplateStringsArray)}
                  {history.status === 'published' && ` v${history.version}`}
                </Typography>
                <Typography color="textSecondary" variant="subtitle2">
                  {dayjs(history.createdAt).format('YYYY-MM-DD HH:mm')}・{history.userId}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Popover>
      <Tooltip title="履歴" placement="top-start">
        <IconButton
          shape="rounded"
          color="secondary"
          onClick={handleOpenHistory}
          disabled={histories.length === 0}
        >
          <RiHistoryLine />
        </IconButton>
      </Tooltip>
    </>
  );
};
