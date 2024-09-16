import { Stack, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Dot from '../../../@extended/components/Dot/index.js';
import { ColorProps } from '../../../@extended/types/extended.js';

type Props = {
  enabled: boolean;
};

export const EnabledDot: React.FC<Props> = ({ enabled }) => {
  const { t } = useTranslation();

  let statusConfig: { color: ColorProps; text: string };
  switch (enabled) {
    case true:
      statusConfig = { color: 'success', text: t('valid') };
      break;
    default:
      statusConfig = { color: 'error', text: t('invalid') };
  }

  return (
    <>
      <Stack direction="row" gap={1} alignItems="center">
        <Dot color={statusConfig.color} />
        <Typography>{statusConfig.text}</Typography>
      </Stack>
    </>
  );
};
