import { Button, IconButton, InputLabel, Stack, TextField, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../../utilities/logger.js';
import { Icon } from '../../../../components/elements/Icon/index.js';
import { usePost } from '../../Context/index.js';

type Props = {
  postId: string;
  slug: string;
};

export const PostSettings: React.FC<Props> = ({ postId, slug }) => {
  const { t } = useTranslation();
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [newSlug, setNewSlug] = useState(slug);

  const { updatePost } = usePost();
  const { trigger: updatePostTrigger } = updatePost(postId);

  const handleSaveSlug = async () => {
    try {
      await updatePostTrigger({
        slug: newSlug,
      });
      setIsEditingSlug(false);
      enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <>
      <InputLabel sx={{ mb: 1 }}>{t('post_slug')}</InputLabel>
      <Stack direction="row" alignItems="center" gap={2}>
        {isEditingSlug ? (
          <>
            <TextField
              type="text"
              sx={{ flexGrow: 1 }}
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
            />
            <Button variant="contained" onClick={handleSaveSlug}>
              {t('save')}
            </Button>
          </>
        ) : (
          <>
            <Typography flexGrow={1}>{slug}</Typography>
            <IconButton onClick={() => setIsEditingSlug(true)}>
              <Icon name="Pencil" size={16} />
            </IconButton>
          </>
        )}
      </Stack>
    </>
  );
};
