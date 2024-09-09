import {
  AppBarProps,
  Box,
  Button,
  Container,
  Dialog,
  Divider,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LocalizedPost } from '../../../../../../types/index.js';
import { logger } from '../../../../../../utilities/logger.js';
import { IconButton } from '../../../../../@extended/components/IconButton/index.js';
import { MainCard } from '../../../../../@extended/components/MainCard/index.js';
import { Icon } from '../../../../../components/elements/Icon/index.js';
import { ModalDialog } from '../../../../../components/elements/ModalDialog/index.js';
import { useAuth } from '../../../../../components/utilities/Auth/index.js';
import { usePost } from '../../../Context/index.js';
import { AppBarStyled } from '../../AppBarStyled.js';
import { SlugSettings } from '../../PostHeader/PublishSettings/SlugSettings/index.js';

export type Props = {
  open: boolean;
  post: LocalizedPost;
  onClose: () => void;
  onTrashed: () => void;
};

export const Settings: React.FC<Props> = ({ open, post, onClose, onTrashed }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { hasPermission } = useAuth();
  const { trashPost, trashLanguageContent, getPost } = usePost();
  const { trigger: trashPostTrigger } = trashPost(post.id);
  const { trigger: trashLanguageContentTrigger } = trashLanguageContent(
    post.id,
    post.contentLanguage
  );
  const { data: mutatedPost, mutate } = getPost(post.id, post.contentLanguage);

  const [openContentTrash, setOpenContentTrash] = useState(false);
  const [openPostTrash, setOpenPostTrash] = useState(false);

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

  const handleOpenLanguageContent = () => {
    setOpenContentTrash((open) => !open);
  };

  const handleOpenPostTrash = () => {
    setOpenPostTrash((open) => !open);
  };

  const handleTrashLanguageContent = async () => {
    try {
      await trashLanguageContentTrigger();
      onTrashed();
      handleOpenLanguageContent();
      enqueueSnackbar(t('toast.move_to_trash'), { variant: 'success' });
    } catch (error) {
      logger.error(error);
    }
  };

  const handleTrashPost = async () => {
    try {
      await trashPostTrigger();
      enqueueSnackbar(t('toast.move_to_trash'), { variant: 'success' });
      handleOpenPostTrash();
      navigate('/admin/posts');
    } catch (error) {
      logger.error(error);
    }
  };

  const handleUpdatedSlug = (slug: string) => {
    mutate({
      ...post,
      slug,
    });
  };

  return (
    <>
      <ModalDialog
        open={openContentTrash}
        color="error"
        title={t('dialog.confirm_content_trash_title', {
          language: t(`languages.${post.contentLanguage}` as unknown as TemplateStringsArray),
        })}
        body={t('dialog.confirm_content_trash')}
        execute={{ label: t('move_to_trash'), action: handleTrashLanguageContent }}
        cancel={{ label: t('cancel'), action: handleOpenLanguageContent }}
      />
      <ModalDialog
        open={openPostTrash}
        color="error"
        title={t('dialog.confirm_all_content_trash_title')}
        body={t('dialog.confirm_content_trash')}
        execute={{ label: t('move_to_trash'), action: handleTrashPost }}
        cancel={{ label: t('cancel'), action: handleOpenPostTrash }}
      />
      <Dialog
        open={open}
        fullScreen
        sx={{ '& .MuiDialog-paper': { bgcolor: 'background.default', backgroundImage: 'none' } }}
      >
        <AppBarStyled open={true} {...appBar}>
          <Toolbar>
            <IconButton color="secondary" onClick={onClose} sx={{ p: 0, position: 'absolute' }}>
              <Icon name="X" size={28} />
            </IconButton>
            <Box width="100%">
              <Typography variant="h3" align="center">
                {t('language_post_settings', {
                  language: t(
                    `languages.${post.contentLanguage}` as unknown as TemplateStringsArray
                  ),
                })}
              </Typography>
            </Box>
          </Toolbar>
        </AppBarStyled>
        <Box component="main">
          <Toolbar sx={{ mt: 0 }} />
          <Container maxWidth="sm">
            {/* Slug */}
            <Stack sx={{ py: 3 }}>
              <Typography variant={'h4'}>{t('post_slug')}</Typography>
            </Stack>
            <MainCard>
              <SlugSettings
                contentId={mutatedPost.contentId}
                slug={mutatedPost.slug}
                onUpdated={(slug) => handleUpdatedSlug(slug)}
              />
            </MainCard>
            {/* Trash post */}
            {hasPermission('trashPost') && (
              <>
                <Stack sx={{ py: 3 }}>
                  <Typography variant={'h4'}>{t('danger_zone')}</Typography>
                </Stack>
                <MainCard>
                  {post.usedLanguages.length > 1 && (
                    <>
                      <Stack flexDirection="row">
                        <Box flexGrow="1">
                          <Typography variant="subtitle1">
                            {t('remove_language_content', {
                              language: t(
                                `languages.${post.contentLanguage}` as unknown as TemplateStringsArray
                              ),
                            })}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {t('move_lang_content_to_trash', {
                              language: t(
                                `languages.${post.contentLanguage}` as unknown as TemplateStringsArray
                              ),
                            })}
                          </Typography>
                        </Box>
                        <Button
                          color="error"
                          startIcon={<Icon name="Trash2" size={16} />}
                          sx={{ pl: 1.5 }}
                          onClick={handleOpenLanguageContent}
                        >
                          {t('move_to_trash')}
                        </Button>
                      </Stack>
                      <Divider sx={{ my: 2 }} />
                    </>
                  )}
                  <Stack flexDirection="row">
                    <Box flexGrow="1">
                      <Typography variant="subtitle1">{t('delete_post')}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {t('move_all_lang_content_to_trash')}
                      </Typography>
                    </Box>
                    <Button
                      color="error"
                      startIcon={<Icon name="Trash2" size={16} />}
                      sx={{ pl: 1.5 }}
                      onClick={handleOpenPostTrash}
                    >
                      {t('move_to_trash')}
                    </Button>
                  </Stack>
                </MainCard>
              </>
            )}
          </Container>
        </Box>
      </Dialog>
    </>
  );
};
