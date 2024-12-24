import { Stack, useTheme } from '@mui/material';
import { ApiKey } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import { RevisedContent } from '../../../../../types/index.js';
import { ApiPreview } from '../../../../components/elements/ApiPreview/index.js';
import { useAuth } from '../../../../components/utilities/Auth/index.js';
import { usePost } from '../../Context/index.js';
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
  const theme = useTheme();
  const { hasPermission } = useAuth();
  const { getApiKeys } = usePost();
  const { trigger: getApiKeyTrigger } = getApiKeys();

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  useEffect(() => {
    const fetchApiKeys = async () => {
      const apiKeys = await getApiKeyTrigger();
      setApiKeys(apiKeys);
    };

    if (hasPermission('readApiKey')) {
      fetchApiKeys();
    }
  }, []);

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
        <ApiPreview
          path={`contents/${content.slug}`}
          apiKeys={apiKeys}
          buttonProps={{
            color: 'secondary',
            shape: 'rounded',
            variant: 'contained',
            sx: {
              color: 'text.primary',
              backgroundColor: theme.palette.grey[200],
              '&:hover': { backgroundColor: theme.palette.grey[300] },
            },
          }}
        />
        <Settings content={content} onTrashed={onTrashed} />
      </Stack>
    </Stack>
  );
};
