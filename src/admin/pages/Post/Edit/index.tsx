import { Box, Button, Container, Stack, TextField, Toolbar, alpha, useTheme } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { UploadFile } from '../../../../types/index.js';
import { logger } from '../../../../utilities/logger.js';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import { useBlockEditor } from '../../../components/elements/BlockEditor/hooks/useBlockEditor.js';
import { BlockEditor } from '../../../components/elements/BlockEditor/index.js';
import { Icon } from '../../../components/elements/Icon/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { PostContextProvider, usePost } from '../Context/index.js';
import { LocalizedContent } from '../LocalizedContent/index.js';
import { PostFooter } from '../PostFooter/index.js';
import { PostHeader } from '../PostHeader/index.js';
import { PublishSettings } from '../PublishSettings/index.js';

const toJson = (value?: string | null) => {
  return value ? JSON.parse(value) : '';
};

export const EditPostPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  if (!id) throw new Error('id is not defined');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const locale = queryParams.get('locale');

  const { getPost, updateContent, trashPost, trashContent, createFileImage, trashLocaleContent } =
    usePost();
  const { data: post, mutate } = getPost(id, locale);
  const { trigger } = updateContent(post.contentId);
  const { trigger: trashPostTrigger } = trashPost(post.id);
  const { trigger: trashContentTrigger } = trashContent(post.contentId);
  const { trigger: trashLocaleContentTrigger } = trashLocaleContent(post.id, post.contentLocale);

  if (!post) return <></>;

  // /////////////////////////////////////
  // Editor
  // /////////////////////////////////////

  const [postTitle, setPostTitle] = useState(post.title);

  const ref = React.useRef<HTMLButtonElement>(null);
  const { editor } = useBlockEditor({
    initialContent: toJson(post.bodyJson),
    ref: ref,
  });

  useEffect(() => {
    setPostTitle(post.title);
    editor?.commands.setContent(toJson(post.bodyJson));
  }, [post]);

  // /////////////////////////////////////
  // Theme
  // /////////////////////////////////////

  const theme = useTheme();
  const bg = theme.palette.background.paper;

  // /////////////////////////////////////
  // Short cut
  // /////////////////////////////////////

  useHotkeys('Meta+s', async () => ref.current?.click(), [], {
    preventDefault: true,
    enableOnFormTags: ['INPUT', 'TEXTAREA'],
  });

  // /////////////////////////////////////
  // File Image
  // /////////////////////////////////////

  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadFile, setUploadFile] = useState<UploadFile | null>(post.file ?? null);
  const { trigger: createFileImageTrigger } = createFileImage();

  const handleUploadThumbnail = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    const params = new FormData();
    params.append('file', file);

    const res = await createFileImageTrigger(params);
    setUploadFile(res.files[0]);

    try {
      await saveContent({
        ...buildParams(),
        fileId: res.files[0].id,
      });
    } catch (error) {
      logger.error(error);
    }
  };

  const handleDeleteThumbnail = async () => {
    setUploadFile(null);
    try {
      await saveContent({
        ...buildParams(),
        fileId: null,
      });
    } catch (error) {
      logger.error(error);
    }
  };

  // /////////////////////////////////////
  // Open settings
  // /////////////////////////////////////

  const [openSettings, setOpenSettings] = useState(false);
  const handleOpenSettings = async () => {
    setOpenSettings(true);
  };

  // /////////////////////////////////////
  // Save content
  // /////////////////////////////////////

  const buildParams = () => {
    return {
      title: postTitle,
      body: editor?.getText() ?? null,
      bodyJson: JSON.stringify(editor?.getJSON()) ?? null,
      bodyHtml: editor?.getHTML() ?? null,
      fileId: uploadFile?.id ?? null,
    };
  };

  const handleSaveContent = async () => {
    try {
      await saveContent(buildParams());
      enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
    } catch (error) {
      logger.error(error);
    }
  };

  const saveContent = async (data: {
    title: string;
    body: string | null;
    bodyJson: string | null;
    bodyHtml: string | null;
    fileId: string | null;
  }) => {
    await trigger(data);
    mutate();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return;
    e.preventDefault();
    editor?.commands.focus();
  };

  // /////////////////////////////////////
  // Content actions
  // /////////////////////////////////////

  const handleRevertContent = async () => {
    try {
      await trashContentTrigger();
      mutate();
      enqueueSnackbar(t('toast.move_to_trash'), { variant: 'success' });
    } catch (error) {
      logger.error(error);
    }
  };

  const handleTrashPost = async () => {
    try {
      await trashPostTrigger();
      enqueueSnackbar(t('toast.move_to_trash'), { variant: 'success' });
      navigate('/admin/posts');
    } catch (error) {
      logger.error(error);
    }
  };

  const handleTrashLocaleContent = async (locale: string) => {
    try {
      await trashLocaleContentTrigger();
      mutate();
      enqueueSnackbar(t('toast.move_to_trash'), { variant: 'success' });
    } catch (error) {
      logger.error(error);
    }
  };

  // /////////////////////////////////////
  // Locale
  // /////////////////////////////////////

  const handleChangeLocale = (locale: string) => {
    navigate(`${window.location.pathname}?locale=${locale}`);
  };

  const [openAddLocale, setOpenAddLocale] = useState(false);
  const handleOpenAddLocale = () => {
    setOpenAddLocale(true);
  };

  const handleCloseAddLocale = () => {
    setOpenAddLocale(false);
  };

  const handleChangedLocale = (locales: string[]) => {
    setOpenAddLocale(false);
    handleChangeLocale(
      locales.find((locale) => locale !== post.contentLocale) ?? post.contentLocale
    );
    mutate({
      ...post,
      locales,
    });
  };

  return (
    <>
      <PostHeader
        post={post}
        currentLocale={post.contentLocale}
        buttonRef={ref}
        onOpenSettings={handleOpenSettings}
        onSaveDraft={handleSaveContent}
        onChangeLocale={handleChangeLocale}
        onOpenAddLocale={handleOpenAddLocale}
        onRevertContent={handleRevertContent}
        onTrashPost={handleTrashPost}
        onTrashLocaleContent={handleTrashLocaleContent}
      />
      <Box component="main" sx={{ minHeight: '100vh', backgroundColor: bg }}>
        <Toolbar sx={{ mt: 0 }} />
        <Container sx={{ py: 10 }}>
          <Box sx={{ maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto' }}>
            <Box sx={{ mb: 2 }}>
              {uploadFile ? (
                <Box
                  sx={{
                    position: 'relative',
                  }}
                >
                  <IconButton
                    shape="rounded"
                    color="secondary"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: alpha('#fff', 0.7),
                    }}
                    onClick={handleDeleteThumbnail}
                  >
                    <Icon name="X" size={20} strokeWidth={1.5} />
                  </IconButton>
                  <img
                    src={uploadFile.url}
                    style={{
                      width: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              ) : (
                <Button
                  variant="text"
                  color="secondary"
                  startIcon={<Icon name="Camera" size={16} />}
                  component="label"
                >
                  {t('add_thumbnail')}
                  <input
                    hidden
                    ref={inputRef}
                    accept="image/*"
                    type="file"
                    onChange={handleUploadThumbnail}
                  />
                </Button>
              )}
            </Box>

            <Stack spacing={1} sx={{ mb: 8 }}>
              <TextField
                type="text"
                fullWidth
                multiline
                placeholder={t('title')}
                value={postTitle}
                autoFocus
                onChange={(e) => setPostTitle(e.target.value)}
                sx={{
                  '.MuiOutlinedInput-notchedOutline': {
                    border: 'none !important',
                  },
                  '.MuiOutlinedInput-root': {
                    padding: 0,
                    lineHeight: 1.85,
                  },
                  '.MuiOutlinedInput-input': {
                    color: theme.palette.text.primary,
                  },
                  '.Mui-focused': {
                    boxShadow: 'none !important',
                  },
                  '& fieldset': { border: 'none' },
                  p: 0,
                }}
                inputProps={{
                  style: {
                    padding: 0,
                    fontSize: '20px',
                  },
                }}
                onKeyDown={handleKeyDown}
              />
            </Stack>
          </Box>
          <BlockEditor editor={editor} />
        </Container>
      </Box>
      <PostFooter
        histories={post.histories}
        characters={editor?.storage.characterCount.characters() ?? 0}
      />
      <PublishSettings
        open={openSettings}
        contentId={post.contentId}
        post={{
          id: post.id,
          slug: post.slug,
          status: post.currentStatus,
        }}
        onClose={() => setOpenSettings(false)}
      />
      <LocalizedContent
        open={openAddLocale}
        post={post}
        onClose={handleCloseAddLocale}
        onChanged={(locales) => handleChangedLocale(locales)}
      />
    </>
  );
};

export const EditPostPage = ComposeWrapper({ context: PostContextProvider })(EditPostPageImpl);
