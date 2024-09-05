import { yupResolver } from '@hookform/resolvers/yup';
import {
  AppBarProps,
  Box,
  Button,
  Container,
  Dialog,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LocalizedPost } from '../../../../../../types/index.js';
import { logger } from '../../../../../../utilities/logger.js';
import { IconButton } from '../../../../../@extended/components/IconButton/index.js';
import { Icon } from '../../../../../components/elements/Icon/index.js';
import { useAuth } from '../../../../../components/utilities/Auth/index.js';
import {
  FormValues,
  editContentValidator,
} from '../../../../../fields/validators/content/editContent.js';
import { usePost } from '../../../Context/index.js';
import { AppBarStyled } from '../../AppBarStyled.js';
import { SlugSettings } from './SlugSettings/index.js';

export type Props = {
  open: boolean;
  contentId: string;
  post: LocalizedPost;
  onClose: () => void;
};

export const PublishSettings: React.FC<Props> = ({ open, contentId, post, onClose }) => {
  const { hasPermission } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { requestReview, publish, archive } = usePost();
  const { trigger: requestReviewTrigger } = requestReview(contentId);
  const { trigger: publishTrigger } = publish(contentId);
  const { trigger: archiveTrigger } = archive(contentId);

  const { currentStatus, slug } = post;

  const appBar: AppBarProps = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      zIndex: 1200,
      width: '100%',
    },
  };

  const {
    watch,
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      status: currentStatus === 'published' ? 'published' : 'review',
      comment: '',
    },
    resolver: yupResolver(editContentValidator()),
  });

  useEffect(() => {
    setValue('status', currentStatus === 'published' ? 'published' : 'review');
  }, [currentStatus]);

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      switch (form.status) {
        case 'archived':
          await archiveTrigger(form);
          break;
        case 'review':
          await requestReviewTrigger(form);
          break;
        case 'published':
          await publishTrigger(form);
          break;
      }

      reset(form);
      enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
      navigate('/admin/posts');
    } catch (error) {
      logger.error(error);
    }
  };

  const getPublishButtonLabel = () => {
    switch (watch('status')) {
      case 'archived':
        return t('archive');
      case 'review':
        return t('publish_for_review');
      case 'published':
        return t('publishing');
      default:
        return '';
    }
  };

  return (
    <Dialog
      open={open}
      fullScreen
      sx={{ '& .MuiDialog-paper': { bgcolor: 'background.paper', backgroundImage: 'none' } }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <AppBarStyled open={true} {...appBar}>
          <Toolbar>
            <IconButton color="secondary" onClick={onClose} sx={{ p: 0, position: 'absolute' }}>
              <Icon name="X" size={28} strokeWidth={1.5} />
            </IconButton>
            <Box width="100%">
              <Typography variant="h3" align="center">
                {t('language_publish_settings', {
                  language: t(
                    `languages.${post.contentLanguage}` as unknown as TemplateStringsArray
                  ),
                })}
              </Typography>
            </Box>
            <Button variant="contained" type="submit" sx={{ position: 'absolute', right: 24 }}>
              {getPublishButtonLabel()}
            </Button>
          </Toolbar>
        </AppBarStyled>
        <Box component="main">
          <Toolbar sx={{ mt: 0 }} />
          <Container maxWidth="sm">
            <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
              <FormControl component="fieldset">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup value={field.value} name="radio-buttons-group" row>
                      {currentStatus === 'published' && (
                        <FormControlLabel
                          {...field}
                          value="archived"
                          control={<Radio />}
                          label={t('archived')}
                        />
                      )}
                      <FormControlLabel
                        {...field}
                        value="review"
                        control={<Radio />}
                        label={t('review')}
                      />
                      {hasPermission('publishPost') && (
                        <FormControlLabel
                          {...field}
                          value="published"
                          control={<Radio />}
                          label={t('publish')}
                        />
                      )}
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Box>
            {watch('status') === 'review' && (
              <>
                <Grid container spacing={3}>
                  <Grid xs={12}>
                    <Stack spacing={1}>
                      <InputLabel required>{t('comment')}</InputLabel>
                      <Controller
                        name="comment"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            error={errors.comment !== undefined}
                          />
                        )}
                      />
                      <FormHelperText error>{errors.comment?.message}</FormHelperText>
                    </Stack>
                  </Grid>
                </Grid>
              </>
            )}
          </Container>
        </Box>
      </form>
      {watch('status') === 'published' && (
        <Container maxWidth="sm" sx={{ mt: 3 }}>
          <SlugSettings contentId={contentId} slug={slug} />
        </Container>
      )}
    </Dialog>
  );
};
