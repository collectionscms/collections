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
import { RiCloseLine } from '@remixicon/react';
import { enqueueSnackbar } from 'notistack';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { logger } from '../../../../utilities/logger.js';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import { useAuth } from '../../../components/utilities/Auth/index.js';
import {
  FormValues,
  editContentValidator,
} from '../../../fields/validators/content/editContent.js';
import { usePost } from '../Context/index.js';
import AppBarStyled from '../PostHeader/AppBarStyled.js';

export type Props = {
  open: boolean;
  contentId: string;
  status: string;
  onClose: () => void;
};

export const PublishSetting: React.FC<Props> = ({ open, contentId, status, onClose }) => {
  const { hasPermission } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { requestReview, publish } = usePost();
  const { trigger: requestReviewTrigger } = requestReview(contentId);
  const { trigger: publishTrigger } = publish(contentId);

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
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      status: status !== 'published' ? 'review' : 'published',
      title: '',
      body: '',
    },
    resolver: yupResolver(editContentValidator()),
  });

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      if (form.status === 'review') {
        await requestReviewTrigger(form);
      } else {
        await publishTrigger(form);
      }

      reset(form);
      enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
      navigate('/admin/posts');
    } catch (error) {
      logger.error(error);
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
            <Stack direction="row" sx={{ flexGrow: 1 }} alignItems="center">
              <IconButton shape="rounded" color="secondary" onClick={onClose}>
                <RiCloseLine />
              </IconButton>
            </Stack>
            <Button variant="contained" type="submit">
              {status === 'published'
                ? t('updating')
                : watch('status') === 'review'
                  ? t('publish_for_review')
                  : t('publishing')}
            </Button>
          </Toolbar>
        </AppBarStyled>
        <Box component="main" sx={{ minHeight: '100vh' }}>
          <Toolbar sx={{ mt: 0 }} />
          <Container
            maxWidth="sm"
            sx={{
              py: 4,
            }}
          >
            <Typography variant={'h1'} align="center">
              {t('publish_settings')}
            </Typography>
            <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
              <FormControl component="fieldset">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup value={field.value} name="radio-buttons-group" row>
                      <FormControlLabel
                        {...field}
                        value="review"
                        disabled={status === 'published'}
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
                      <InputLabel required>{t('title')}</InputLabel>
                      <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="text"
                            fullWidth
                            error={errors.title !== undefined}
                          />
                        )}
                      />
                      <FormHelperText error>{errors.title?.message}</FormHelperText>
                    </Stack>
                  </Grid>
                  <Grid xs={12}>
                    <Stack spacing={1}>
                      <InputLabel>{t('description')}</InputLabel>
                      <Controller
                        name="body"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            error={errors.body !== undefined}
                          />
                        )}
                      />
                      <FormHelperText error>{errors.body?.message}</FormHelperText>
                    </Stack>
                  </Grid>
                </Grid>
              </>
            )}
          </Container>
        </Box>
      </form>
    </Dialog>
  );
};
