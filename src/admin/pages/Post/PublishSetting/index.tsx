import { CloseOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Dialog,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LocalizedPost } from '../../../../types/index.js';
import { logger } from '../../../../utilities/logger.js';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import { MainCard } from '../../../@extended/components/MainCard/index.js';
import { FormValues, editPostValidator } from '../../../fields/validators/post/editPost.js';
import { usePost } from '../Context/index.js';

export type Props = {
  open: boolean;
  post: LocalizedPost;
  onClose: () => void;
};

export const PublishSetting: React.FC<Props> = ({ open, post, onClose }) => {
  const navigate = useNavigate();
  const { updatePost } = usePost();
  const { trigger } = updatePost(post.id);

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
        <Grid container justifyContent="center" sx={{ minHeight: '100vh', py: 2.5 }}>
          <Grid item>
            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', p: 1 }}>
              <IconButton shape="rounded" color="secondary" onClick={onClose}>
                <CloseOutlined />
              </IconButton>
            </Box>
            <MainCard border={false}>
              <Stack spacing={2} alignItems="center">
                <Typography variant={'h1'} align="center">
                  {t('publish_settings')}
                </Typography>
                <Box sx={{ px: 2.5 }}>
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
                <Stack direction="row" justifyContent="center" spacing={3}>
                  <Button variant="contained" type="submit">
                    {post.status === 'published'
                      ? t('updating')
                      : watch('status') === 'review'
                      ? t('publish_for_review')
                      : t('publishing')}
                  </Button>
                </Stack>
              </Stack>
            </MainCard>
          </Grid>
        </Grid>
      </form>
    </Dialog>
  );
};
