import { Stack, Typography } from '@mui/material';
import { Tag } from '@prisma/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../../../../utilities/logger.js';
import { usePost } from '../../../../Context/index.js';
import { TagSelector } from '../ui/TagSelector/index.js';

type Props = {
  contentId: string;
  inputtedTags: Tag[];
};

export const TagSettings: React.FC<Props> = ({ contentId, inputtedTags }) => {
  const { t } = useTranslation();
  const { createTags, getTags } = usePost();
  const { trigger: createTagsTrigger } = createTags(contentId);
  const { data: allTags } = getTags();

  const options = allTags
    ? allTags.map((tag) => ({
        value: tag.name,
        label: tag.name,
      }))
    : [];

  const values = inputtedTags.map((tag) => ({
    value: tag.name,
    label: tag.name,
  }));

  const handleTagChange = async (names: string[]) => {
    try {
      await createTagsTrigger({
        names,
      });
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <Stack gap={1}>
      <Typography variant="subtitle1">{t('add_tags')}</Typography>
      <TagSelector options={options} values={values} onChange={handleTagChange} />
      <Typography variant="caption" color="text.secondary">
        {t('tags_hint')}
      </Typography>
    </Stack>
  );
};
