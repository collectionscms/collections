import { yupResolver } from '@hookform/resolvers/yup';
import {
  AppBarProps,
  Box,
  Button,
  Container,
  Dialog,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { RiCloseLine } from '@remixicon/react';
import { t } from 'i18next';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LocalizedPost } from '../../../../types/index.js';
import { logger } from '../../../../utilities/logger.js';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import AppBarStyled from '../PostHeader/AppBarStyled.js';
import { FormValues, editPostValidator } from '../../../fields/validators/post/editPost.js';
import { usePost } from '../Context/index.js';

export type Props = {
  open: boolean;
  post: LocalizedPost;
  onClose: () => void;
};

export const PublishSetting: React.FC<Props> = ({ open, post, onClose }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { updatePost } = usePost();
  const { trigger } = updatePost(post.id);

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
      slug: post.slug,
      status: post.status !== 'published' ? 'review' : 'published',
    },
    resolver: yupResolver(editPostValidator()),
  });

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      await trigger(form);
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
              {post.status === 'published'
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
                        disabled={post.status === 'published'}
                        control={<Radio />}
                        label={t('review')}
                      />
                      <FormControlLabel
                        {...field}
                        value="published"
                        control={<Radio />}
                        label={t('publish')}
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Box>
          </Container>
        </Box>
      </form>
    </Dialog>
  );
};
