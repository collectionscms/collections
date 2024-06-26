import { CameraOutlined, CloseOutlined } from '@ant-design/icons';
import { Box, Button, Container, Stack, TextField, Toolbar, alpha, useTheme } from '@mui/material';
import { Extension } from '@tiptap/core';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { UploadFile } from '../../../../types/index.js';
import { logger } from '../../../../utilities/logger.js';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import { WYSIWYG } from '../../../components/elements/WYSIWYG/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { AddLocale } from '../AddLocale/index.js';
import { PostContextProvider, usePost } from '../Context/index.js';
import { PostFooter } from '../PostFooter/index.js';
import { PostHeader } from '../PostHeader/index.js';
import { PublishSetting } from '../PublishSetting/index.js';

export const EditPostPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  if (!id) throw new Error('id is not defined');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const locale = queryParams.get('locale');

  const { getPost, updateContent, trashContent, createFileImage } = usePost();
  const { data: post, mutate } = getPost(id, locale);
  const { trigger } = updateContent(post.contentId);
  const { trigger: trashTrigger } = trashContent(post.contentId);

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

  const ref = React.useRef<HTMLButtonElement>(null);
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
    await saveContent(buildParams());
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

  const toJson = (value?: string | null) => {
    return value ? JSON.parse(value) : '';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return;
    e.preventDefault();
    editor?.commands.focus();
  };

  // /////////////////////////////////////
  // Trash draft content
  // /////////////////////////////////////

  const handleTrashContent = async () => {
    try {
      await trashTrigger();
      mutate();
      enqueueSnackbar(t('toast.deleted_successfully'), { variant: 'success' });
    } catch (error) {
      logger.error(error);
    }
  };

  // /////////////////////////////////////
  // Editor
  // /////////////////////////////////////

  const [postTitle, setPostTitle] = useState(post.title);

  const extensions = [
    StarterKit.configure({
      heading: {
        levels: [2, 3],
        HTMLAttributes: {
          class: 'heading',
        },
      },
    }),
    Underline,
    CharacterCount,
    Placeholder.configure({ placeholder: t('write_the_text') }),
    Extension.create({
      addKeyboardShortcuts() {
        return {
          'Mod-s': () => {
            ref.current?.click();
            return true;
          },
        };
      },
    }),
  ];

  const editor = useEditor({
    extensions,
    content: toJson(post.bodyJson),
  });

  // /////////////////////////////////////
  // Locale
  // /////////////////////////////////////

  const handleChangeLocale = (locale: string) => {
    window.location.href = `${window.location.pathname}?locale=${locale}`;
  };

  const [openAddLocale, setOpenAddLocale] = useState(false);
  const handleOpenAddLocale = () => {
    setOpenAddLocale(true);
  };

  const handleCloseAddLocale = () => {
    setOpenAddLocale(false);
  };

  const handleAddedLocale = (locale: string) => {
    setOpenAddLocale(false);
    mutate();
    handleChangeLocale(locale);
    enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
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
        onTrashContent={handleTrashContent}
      />
      <Box component="main" sx={{ minHeight: '100vh', backgroundColor: bg }}>
        <Toolbar sx={{ mt: 0 }} />
        <Container maxWidth="sm">
          <Box sx={{ p: 10 }}>
            <Box sx={{ mb: 1 }}>
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
                    <CloseOutlined />
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
                  startIcon={<CameraOutlined />}
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
            <WYSIWYG editor={editor} />
          </Box>
        </Container>
      </Box>
      <PostFooter
        histories={post.histories}
        characters={editor?.storage.characterCount.characters() ?? 0}
      />
      <PublishSetting
        open={openSettings}
        contentId={post.contentId}
        status={post.status}
        onClose={() => setOpenSettings(false)}
      />
      <AddLocale
        open={openAddLocale}
        post={post}
        onClose={handleCloseAddLocale}
        onAdded={handleAddedLocale}
      />
    </>
  );
};

export const EditPostPage = ComposeWrapper({ context: PostContextProvider })(EditPostPageImpl);
