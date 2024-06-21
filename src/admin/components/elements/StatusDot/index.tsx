import { Stack, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Dot from '../../../@extended/components/Dot/index.js';
import { ColorProps } from '../../../@extended/types/extended.js';

type Props = {
  status: string;
};

export const StatusDot: React.FC<Props> = ({ status }) => {
  const { t } = useTranslation();

  let statusConfig: { color: ColorProps; text: string };
  switch (status) {
    case 'draft':
      statusConfig = { color: 'default', text: t('draft') };
      break;
    case 'review':
      statusConfig = { color: 'warning', text: t('review') };
      break;
    case 'published':
      statusConfig = { color: 'success', text: t('published') };
      break;
    default:
      statusConfig = { color: 'error', text: t('archived') };
  }

  return (
    <>
      <Stack direction="row" gap={1} alignItems="center">
        <Dot color={statusConfig.color} size={12} />
        <Typography>{statusConfig.text}</Typography>
      </Stack>
    </>
  );
};
