import { Stack } from '@mui/material';
import React from 'react';
import { RevisedContent } from '../../../../../types/index.js';
import { Information } from './Information/index.js';
import { Revision } from './Revision/index.js';
import { Settings } from './Settings/index.js';

export type Props = {
  content: RevisedContent;
  characters: number;
  onTrashed: () => void;
  onReverted: () => void;
};

export const PostFooter: React.FC<Props> = ({ content, characters, onTrashed, onReverted }) => {
  return (
    <Stack
      flexDirection="row"
      justifyContent="space-between"
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        p: 3,
      }}
    >
      <Stack flexDirection="row" gap={2}>
        <Revision content={content} onReverted={onReverted} />
        <Information characters={characters} />
      </Stack>
      <Stack flexDirection="row" gap={2}>
        <Settings content={content} onTrashed={onTrashed} />
      </Stack>
    </Stack>
  );
};
