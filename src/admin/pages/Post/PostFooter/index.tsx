import { Box, Stack, Typography } from '@mui/material';
import { ContentHistory } from '@prisma/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { History } from '../History/index.js';

export type Props = {
  histories: ContentHistory[];
  characters: number;
};

export const PostFooter: React.FC<Props> = ({ histories, characters }) => {
  const { t } = useTranslation();
  const sortedHistories = histories.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        p: 4,
      }}
    >
      <Stack direction="row" gap={2}>
        <History histories={sortedHistories} />
      </Stack>
      <Typography color="secondary">
        <>
          {characters} {t('characters')}
        </>
      </Typography>
    </Box>
  );
};
