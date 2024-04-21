import { Box, Stack, Typography } from '@mui/material';
import { PostHistory } from '@prisma/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Guide } from '../Guide/index.js';
import { History } from '../History/index.js';

export type Props = {
  histories: PostHistory[];
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
        <Guide />
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