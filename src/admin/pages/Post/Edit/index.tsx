import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { logger } from '../../../../utilities/logger.js';
import { IconButton } from '../../../@extended/components/IconButton/index.js';
import { useBlockEditor } from '../../../components/elements/BlockEditor/hooks/useBlockEditor.js';
import { BlockEditor } from '../../../components/elements/BlockEditor/index.js';
import { ConfirmDiscardDialog } from '../../../components/elements/ConfirmDiscardDialog/index.js';
import { Icon } from '../../../components/elements/Icon/index.js';
import { useColorMode } from '../../../components/utilities/ColorMode/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { AddLanguage } from '../AddLanguage/index.js';
import { PostContextProvider, usePost } from '../Context/index.js';
import { PostFooter } from './PostFooter/index.js';
import { PostHeader } from './PostHeader/index.js';
import { PublishSettings } from './PostHeader/PublishSettings/index.js';
import { enqueueSnackbar } from 'notistack';

const toJson = (value?: string | null) => {
  return value ? JSON.parse(value) : '';
};

export const EditPostPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  if (!id) throw new Error('id is not defined');

  const { getContent, updateContent, createFileImage, translateContent, simplifySentence } =
    usePost();
  const { data: content, mutate } = getContent(id);
  const { trigger: updateContentTrigger, isMutating: isSaving } = updateContent(content.id);
  const { trigger: translateTrigger } = translateContent(content.postId);
  const { trigger: simplifySentenceTrigger } = simplifySentence(content.id);

  const [isDirty, setIsDirty] = useState(false);
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const [showSubtitle, setShowSubtitle] = useState(content.subtitle ? true : false);

  if (!content) return <></>;

  // On mount, or update content when language is changed
  useEffect(() => {
    setPostTitle(content.title);
    setPostSubtitle(content.subtitle ?? '');
    const showSubtitle = content.subtitle ? true : false;
    setShowSubtitle(showSubtitle);
    setUploadCover(content.coverUrl ?? null);
    editor?.commands.setContent(toJson(content.bodyJson));
  }, [content.language]);

  // /////////////////////////////////////
  // Title
  // /////////////////////////////////////

  const [postTitle, setPostTitle] = useState(content.title);

  const handleChangeTitle = (value: string) => {
    setPostTitle(value);
    setIsDirty(true);
  };

  const handleKeyDownInTitle = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return;
    e.preventDefault();
    if (showSubtitle) {
      subTitleRef.current?.focus();
    } else {
      editor?.commands.focus();
    }
  };

  // /////////////////////////////////////
  // Subtitle
  // /////////////////////////////////////

  const subTitleRef = useRef<HTMLInputElement>(null);
  const [postSubtitle, setPostSubtitle] = useState(content.subtitle);

  const handleChangeSubtitle = (value: string) => {
    setPostSubtitle(value);
    setIsDirty(true);
  };

  const handleKeyDownInSubtitle = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return;
    e.preventDefault();
    editor?.commands.focus();
  };

  const handleHideSubtitle = () => {
    setPostSubtitle('');
    setShowSubtitle(false);
  };

  // /////////////////////////////////////
  // Editor
  // /////////////////////////////////////

  const { mode } = useColorMode();
  const ref = React.useRef<HTMLButtonElement>(null);
  const { editor, characterCount } = useBlockEditor({
    initialContent: toJson(content.bodyJson),
    ref: ref,
    mode,
  });

  useEffect(() => {
    if (isDirty) {
      // auto save after 5 seconds
      const timer = setTimeout(async () => {
        await handleSaveContent();
        setIsDirty(false);
      }, 5_000);

      return () => clearTimeout(timer);
    }
  }, [isDirty, postTitle, editor?.getText()]);

  useEffect(() => {
    if (editor) {
      const handleUpdate = () => {
        setIsDirty(true);
      };

      // Set the cursor to the beginning of the editor
      editor.commands.setTextSelection(0);
      editor.view.focus();

      editor.on('update', handleUpdate);

      return () => {
        editor.off('update', handleUpdate);
      };
    }
  }, [editor]);

  // /////////////////////////////////////
  // Theme
  // /////////////////////////////////////

  const theme = useTheme();

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
  const [uploadCover, setUploadCover] = useState<string | null>(content.coverUrl);
  const { trigger: createFileImageTrigger } = createFileImage();

  const handleUploadCover = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    const params = new FormData();
    params.append('file', file);

    const res = await createFileImageTrigger(params);
    const uploadedFile = res.files[0];
    setUploadCover(uploadedFile.url);

    try {
      await saveContent({
        ...buildParams(),
        coverUrl: uploadedFile.url,
      });
    } catch (error) {
      logger.error(error);
    }
  };

  const handleDeleteCover = async () => {
    setUploadCover(null);
    try {
      await saveContent({
        ...buildParams(),
        coverUrl: null,
      });
    } catch (error) {
      logger.error(error);
    }
  };

  // /////////////////////////////////////
  // Save content
  // /////////////////////////////////////

  const buildParams = () => {
    return {
      title: postTitle,
      subtitle: postSubtitle,
      body: editor?.getText() ?? null,
      bodyJson: JSON.stringify(editor?.getJSON()) ?? null,
      bodyHtml: editor?.getHTML() ?? null,
      coverUrl: uploadCover ?? null,
    };
  };

  const handleSaveContent = async () => {
    try {
      await saveContent(buildParams());
    } catch (error) {
      logger.error(error);
    }
  };

  const saveContent = async (data: {
    title: string;
    subtitle: string | null;
    body: string | null;
    bodyJson: string | null;
    bodyHtml: string | null;
    coverUrl: string | null;
  }) => {
    try {
      await updateContentTrigger(data);
      setIsDirty(false);
    } catch (error) {
      logger.error(error);
    }
  };

  // /////////////////////////////////////
  // Content actions
  // /////////////////////////////////////

  const handleMutate = () => {
    mutate();
  };

  const handleTrashed = () => {
    const languageContent = content.languageContents.filter((c) => c.contentId !== content.id)?.[0];
    navigate(`/admin/contents/${languageContent.contentId}`, { replace: true });
  };

  // /////////////////////////////////////
  // Open settings
  // /////////////////////////////////////

  const [openPublishSettings, setOpenPublishSettings] = useState(false);
  const handleOpenPublishSettings = async () => {
    if (isDirty) {
      await handleSaveContent();
    }
    setOpenPublishSettings((open) => !open);
  };

  // /////////////////////////////////////
  // Language
  // /////////////////////////////////////

  const handleChangeLanguage = (contentId: string) => {
    navigate(`/admin/contents/${contentId}`, { replace: true });
  };

  const [openAddLanguage, setOpenAddLanguage] = useState(false);
  const handleOpenAddLanguage = () => {
    setOpenAddLanguage(true);
  };

  const handleCloseAddLanguage = () => {
    setOpenAddLanguage(false);
  };

  const [isTranslating, setIsTranslating] = useState(false);
  const handleTranslate = async () => {
    try {
      setIsTranslating(true);
      const response = await translateTrigger({
        sourceLanguage: content.sourceLanguageCode,
        targetLanguage: content.targetLanguageCode,
      });
      handleChangeTitle(response.title);
      handleChangeSubtitle(response.subtitle);
      editor?.commands.setContent(response.body);
    } catch (error) {
      logger.error(error);
    } finally {
      setIsTranslating(false);
    }
  };

  // /////////////////////////////////////
  // Editing by AI
  // /////////////////////////////////////

  const handleEditingByAI = async (from: number, to: number, text: string) => {
    if (!editor) return;

    try {
      const result = await simplifySentenceTrigger({
        text,
      });

      const { tr, schema } = editor.state;
      const textNode = schema.text(result.text);
      tr.replaceWith(from, to, textNode);
      editor.view.dispatch(tr);

      enqueueSnackbar(t('toast.edited'), {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isTranslating}
        onClick={() => setIsTranslating(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Button ref={ref} onClick={handleSaveContent} />
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <PostHeader
        content={content}
        currentLanguage={content.language}
        isSaving={isSaving}
        onChangeLanguage={handleChangeLanguage}
        onOpenAddLanguage={handleOpenAddLanguage}
        onReverted={handleMutate}
        onOpenPublishSettings={handleOpenPublishSettings}
      />
      <PostFooter
        content={content}
        characters={characterCount.characters()}
        onTrashed={handleTrashed}
        onReverted={handleMutate}
      />
      <PublishSettings
        open={openPublishSettings}
        content={content}
        onClose={() => setOpenPublishSettings(false)}
      />
      <Box component="main" sx={{ minHeight: '100vh' }}>
        <Toolbar sx={{ mt: 0 }} />
        <Container sx={{ pt: 6, pb: 48 }}>
          <Box sx={{ maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto', mb: 6 }}>
            {postTitle.length === 0 &&
              (!postSubtitle || postSubtitle.length === 0) &&
              characterCount.characters() === 0 &&
              content.canTranslate && (
                <Stack
                  direction="row"
                  gap={1}
                  sx={{ mb: 4, alignItems: 'center' }}
                  color="secondary"
                >
                  <Icon name="Languages" size={16} />
                  <Typography>
                    {t('translate_source_to_target', {
                      sourceLanguage: t(
                        `languages.${content.sourceLanguageCode}` as unknown as TemplateStringsArray
                      ),
                      targetLanguage: t(
                        `languages.${content.targetLanguageCode}` as unknown as TemplateStringsArray
                      ),
                    })}
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    color="inherit"
                    sx={{
                      width: 40,
                      height: 40,
                      textDecoration: 'underline',
                      textDecorationStyle: 'dotted',
                      textUnderlineOffset: '0.3rem',
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    }}
                    onClick={handleTranslate}
                  >
                    {t('i_do')}
                  </Button>
                </Stack>
              )}

            {/* Actions */}
            <Stack flexDirection="row" gap={1} sx={{ mb: 2 }}>
              {!uploadCover && (
                <Button
                  variant="text"
                  color="secondary"
                  component="label"
                  sx={{ color: 'text.primary' }}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Icon name="Image" size={16} />
                    <Typography variant="button">{t('add_cover')}</Typography>
                    <input
                      hidden
                      ref={inputRef}
                      accept="image/*"
                      type="file"
                      onChange={handleUploadCover}
                    />
                  </Stack>
                </Button>
              )}
              {!showSubtitle && (
                <Button
                  variant="text"
                  color="secondary"
                  component="label"
                  sx={{ color: 'text.primary' }}
                  onClick={() => setShowSubtitle(true)}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Icon name="Text" size={16} />
                    <Typography variant="button">{t('add_subtitle')}</Typography>
                  </Stack>
                </Button>
              )}
            </Stack>

            {/* Cover */}
            {uploadCover && (
              <Box
                sx={{
                  position: 'relative',
                  mb: 3,
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
                  onClick={handleDeleteCover}
                >
                  <Icon name="X" size={20} strokeWidth={1.5} />
                </IconButton>
                <img
                  src={uploadCover}
                  style={{
                    width: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            )}

            {/* Title */}
            <TextField
              type="text"
              fullWidth
              multiline
              placeholder={t('title')}
              value={postTitle}
              onChange={(e) => handleChangeTitle(e.target.value)}
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
                  fontSize: '2.25rem',
                  lineHeight: '2.7rem',
                  fontWeight: 'bold',
                },
              }}
              onKeyDown={handleKeyDownInTitle}
            />

            {showSubtitle && (
              <Box sx={{ position: 'relative', mt: 4 }}>
                <TextField
                  type="text"
                  inputRef={subTitleRef}
                  fullWidth
                  multiline
                  placeholder={`${t('add_subtitle')}…`}
                  value={postSubtitle}
                  onChange={(e) => handleChangeSubtitle(e.target.value)}
                  sx={{
                    '.MuiOutlinedInput-notchedOutline': {
                      border: 'none !important',
                    },
                    '.MuiOutlinedInput-root': {
                      padding: 0,
                      lineHeight: 1.85,
                    },
                    '.MuiOutlinedInput-input': {
                      color: theme.palette.text.secondary,
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
                      fontSize: '1.15rem',
                      lineHeight: '1.725rem',
                    },
                  }}
                  onKeyDown={handleKeyDownInSubtitle}
                />
                <Tooltip title={t('remove_subtitle')} placement="bottom">
                  <IconButton
                    color="secondary"
                    sx={{ position: 'absolute', width: 28, height: 28, p: 0 }}
                    onClick={handleHideSubtitle}
                  >
                    <Icon name="X" size={20} />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
          <BlockEditor editor={editor} onEditingByAI={handleEditingByAI} />
        </Container>
      </Box>
      <AddLanguage
        open={openAddLanguage}
        content={content}
        onAdd={(language) => handleChangeLanguage(language)}
        onClose={handleCloseAddLanguage}
      />
    </>
  );
};

export const EditPostPage = ComposeWrapper({ context: PostContextProvider })(EditPostPageImpl);
