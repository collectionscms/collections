import { Stack, Typography } from '@mui/material';
import { Tag } from '@prisma/client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../../../../utilities/logger.js';
import { CreatableSelector } from '../../../../../../components/elements/CreatableSelector/index.js';
import { usePost } from '../../../../Context/index.js';

type Props = {
  contentId: string;
  inputtedTags: Tag[];
};

export const TagSettings: React.FC<Props> = ({ contentId, inputtedTags }) => {
  const { t } = useTranslation();
  const { createTags, getTags } = usePost();
  const { trigger: createTagsTrigger } = createTags(contentId);
  const { data: allTags } = getTags();
  const [tags, setTags] = useState<{ value: string; label: string }[]>(
    inputtedTags.map((tag) => ({ value: tag.name, label: tag.name }))
  );

  const options = allTags
    ? allTags.map((tag) => ({
        value: tag.name,
        label: tag.name,
      }))
    : [];

  const handleTagChange = async (selectedValues: string[]) => {
    try {
      setTags(selectedValues.map((value) => ({ value, label: value })));
      await createTagsTrigger({
        names: selectedValues,
      });
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <Stack gap={1}>
      <Typography variant="subtitle1">{t('add_tags')}</Typography>
      <CreatableSelector
        options={options}
        values={tags}
        placeholder={t('tags_placeholder')}
        onChange={handleTagChange}
      />
      <Typography variant="caption" color="text.secondary">
        {t('tags_hint')}
      </Typography>
    </Stack>
  );
};
