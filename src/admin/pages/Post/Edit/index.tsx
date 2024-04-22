import { Box, Button, Container, Stack, TextField, Toolbar } from '@mui/material';
import { RiImageLine } from '@remixicon/react';
import { Extension } from '@tiptap/core';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import { Underline } from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { t } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import React, { useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useParams } from 'react-router-dom';
import { UploadFile } from '../../../../types/index.js';
import { logger } from '../../../../utilities/logger.js';
import { WYSIWYG } from '../../../components/elements/WYSIWYG/index.js';
import { useColorMode } from '../../../components/utilities/ColorMode/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { AddLocale } from '../AddLocale/index.js';
import { PostContextProvider, usePost } from '../Context/index.js';
import { PostFooter } from '../PostFooter/index.js';
import { PostHeader } from '../PostHeader/index.js';
import { PublishSetting } from '../PublishSetting/index.js';

export const EditPostPageImpl: React.FC = () => {
  const { id } = useParams();
  if (!id) throw new Error('id is not defined');

  useHotkeys('Meta+s', async () => ref.current?.click(), [], {
    preventDefault: true,
    enableOnFormTags: ['INPUT'],
  });

  const ref = React.useRef<HTMLButtonElement>(null);

  const { mode } = useColorMode();
  const bg = mode === 'light' ? '#fff' : '#1e1e1e';

  const { getPost, updateContent, createFileImage } = usePost();
  const { data: post, mutate } = getPost(id);
  const [locale, setLocale] = useState(post.contentLocale);
  const content = post.contents.find((content) => content.locale === locale);
  const { trigger } = updateContent(content?.id ?? '');

  // /////////////////////////////////////
  // File Image
  // /////////////////////////////////////

  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadFile, setUploadFile] = useState<UploadFile | null>(content?.file ?? null);
  const { trigger: createFileImageTrigger } = createFileImage();

  const handleUploadThumbnail = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    const params = new FormData();
    params.append('file', file);

    try {
      const res = await createFileImageTrigger(params);
      setUploadFile(res.file);
    } catch (e) {
      logger.error(e);
    }
  };

  // /////////////////////////////////////
  // Save content
  // /////////////////////////////////////

  const [openSettings, setOpenSettings] = useState(false);
  const handleOpenSettings = async () => {
    try {
      await handleSaveContent(false);
      mutate();
      setOpenSettings(true);
    } catch (error) {
      logger.error(error);
    }
  };

  const handleSaveContent = async (showSnackbar: boolean = true) => {
    try {
      const body = editor?.getText();
      const bodyJson = editor?.getJSON();
      const bodyHtml = editor?.getHTML();

      await trigger({
        title: title,
        body,
        bodyJson: JSON.stringify(bodyJson),
        bodyHtml,
        fileId: uploadFile?.id ?? null,
      });
      mutate();

      if (showSnackbar) {
        enqueueSnackbar(t('saved'), { variant: 'success' });
      }
    } catch (error) {
      logger.error(error);
    }
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
  // Editor
  // /////////////////////////////////////

  const [title, setTitle] = useState(post.title);

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
    setLocale(locale);

    const content = post.contents.find((content) => content.locale === locale);
    setTitle(content?.title ?? '');
    setUploadFile(content?.file ?? null);
    editor?.commands.setContent(toJson(content?.bodyJson));
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
        currentLocale={locale}
        buttonRef={ref}
        onOpenSettings={handleOpenSettings}
        onDraftSave={handleSaveContent}
        onChangeLocale={handleChangeLocale}
        onOpenAddLocale={handleOpenAddLocale}
      />
      <Box component="main" sx={{ minHeight: '100vh', backgroundColor: bg }}>
        <Toolbar sx={{ mt: 0 }} />
        <Container maxWidth="sm">
          <Box sx={{ p: 10 }}>
            <Box sx={{ mb: 1 }}>
              {uploadFile ? (
                <img
                  src={uploadFile.url}
                  style={{
                    width: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Button
                  variant="text"
                  color="secondary"
                  startIcon={<RiImageLine size={22} />}
                  component="label"
                >
                  サムネイル画像を追加
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
                value={title}
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
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
      <PublishSetting open={openSettings} post={post} onClose={() => setOpenSettings(false)} />
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
