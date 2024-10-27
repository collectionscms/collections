/* eslint-disable max-len */
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TemplateCard } from '../../components/elements/TemplateCard/index.js';

export const TemplatePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={3}>
      <TemplateCard
        coverUrl="http://cdn.collections.dev/nextjs-blog-starter.png"
        title="Next.js Blog Starter"
        description={t('nextjs_blog_starter_description')}
        gitHubUrl="https://github.com/collectionscms/collections/tree/main/templates/nextjs-blog-cms"
        demoUrl="https://collections-nextjs-blog.vercel.app/"
        deployUrl="https://vercel.com/new/clone?repository-url=https://github.com/collectionscms/nextjs-blog-starter&repository-name=collections-nextjs-blog&env=COLLECTIONS_API_ORIGIN,COLLECTIONS_API_KEY&envDescription=Required%20to%20connect%20the%20app%20with%20Collections&envLink=https://github.com/collectionscms/nextjs-blog-starter"
      />
    </Grid>
  );
};
