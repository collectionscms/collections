import { Button, CardContent, CardMedia, IconButton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MainCard } from '../../../@extended/components/MainCard/index.js';
import { Icon } from '../Icon/index.js';

type Props = {
  coverUrl: string;
  title: string;
  description: string;
  gitHubUrl?: string;
  demoUrl?: string;
  deployUrl?: string;
};

export const TemplateCard: React.FC<Props> = ({
  coverUrl,
  title,
  description,
  gitHubUrl,
  demoUrl,
  deployUrl,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Grid xs={12} sm={6} lg={4}>
      <MainCard content={false}>
        <CardMedia component="img" image={coverUrl} alt="green iguana" />
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {description}
          </Typography>
        </CardContent>
        <Stack
          direction="row"
          className="hideforPDf"
          alignItems="center"
          justifyContent="end"
          gap={2}
          sx={{ px: 2.5, pb: 2.5 }}
        >
          {gitHubUrl && (
            <IconButton href={gitHubUrl} target="_blank" rel="noopener noreferrer">
              <Icon name="Github" />
            </IconButton>
          )}
          {demoUrl && (
            <Button
              variant="outlined"
              color="secondary"
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('view_demo')}
            </Button>
          )}
          {deployUrl && (
            <Button variant="contained" href={deployUrl} target="_blank" rel="noopener noreferrer">
              {t('deploy')}
            </Button>
          )}
        </Stack>
      </MainCard>
    </Grid>
  );
};
