import { Stack, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocalizedPost } from '../../../../../types/index.js';
import { IconButton } from '../../../../@extended/components/IconButton/index.js';
import { Icon } from '../../../../components/elements/Icon/index.js';
import { History } from './History/index.js';
import { Information } from './Information/index.js';
import { Settings } from './Settings/index.js';

export type Props = {
  post: LocalizedPost;
  characters: number;
  onTrashed: () => void;
  onReverted: () => void;
};

export const PostFooter: React.FC<Props> = ({ post, characters, onTrashed, onReverted }) => {
  const { t } = useTranslation();

  // /////////////////////////////////////
  // Open settings
  // /////////////////////////////////////

  const [openSettings, setOpenSettings] = useState(false);
  const handleOpenSettings = async () => {
    setOpenSettings((open) => !open);
  };

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
        <History post={post} onReverted={onReverted} />
        <Information characters={characters} />
      </Stack>
      <Tooltip title={t('setting')}>
        <IconButton
          color="secondary"
          shape="rounded"
          variant="outlined"
          onClick={handleOpenSettings}
        >
          <Icon strokeWidth={2} name="Settings" />
        </IconButton>
      </Tooltip>
      <Settings
        post={post}
        open={openSettings}
        onClose={handleOpenSettings}
        onTrashed={() => {
          handleOpenSettings();
          onTrashed();
        }}
      />
    </Stack>
  );
};
