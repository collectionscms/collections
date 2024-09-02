import { Stack, Tooltip } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LocalizedPost } from '../../../../../types/index.js';
import { IconButton } from '../../../../@extended/components/IconButton/index.js';
import { Icon } from '../../../../components/elements/Icon/index.js';
import { History } from './History/index.js';

export type Props = {
  post: LocalizedPost;
  onReverted: () => void;
};

export const PostFooter: React.FC<Props> = ({ post, onReverted }) => {
  const { t } = useTranslation();

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
      <History post={post} onReverted={onReverted} />
      <Tooltip title={t('setting')}>
        <IconButton color="secondary" shape="rounded" variant="outlined">
          <Icon strokeWidth={2} name="Settings" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
