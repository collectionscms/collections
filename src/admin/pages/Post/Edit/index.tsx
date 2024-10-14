import { LoadingOutlined } from '@ant-design/icons';
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Toolbar,
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

const toJson = (value?: string | null) => {
  return value ? JSON.parse(value) : '';
};

export const EditPostPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  if (!id) throw new Error('id is not defined');

  const { getContent, updateContent, createFileImage, translateContent } = usePost();
  const { data: content, mutate } = getContent(id);
  const { trigger: updateContentTrigger, isMutating: isSaving } = updateContent(content.id);
  const { trigger: translateTrigger } = translateContent(content.postId);

  const [isDirty, setIsDirty] = useState(false);
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  if (!content) return <></>;

  useEffect(() => {
    setPostTitle(content.title);
    setPostSubtitle(content.subtitle);
    setUploadCover(content.coverUrl ?? null);
    editor?.commands.setContent(toJson(content.bodyJson));
  }, [content]);

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
    subTitleRef.current?.focus();
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
    await updateContentTrigger(data);
    setIsDirty(false);
    mutate();
  };

  // /////////////////////////////////////
  // Content actions
  // /////////////////////////////////////

  const handleMutate = () => {
    mutate();
  };

  const handleTrashed = () => {
    const languageContent = content.languageContents.filter((c) => c.contentId !== content.id)?.[0];
    navigate(`/admin/contents/${languageContent.contentId}`);
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
    navigate(`/admin/contents/${contentId}`);
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
      editor?.commands.setContent(response.body);
    } catch (error) {
      logger.error(error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <>
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
        onTrashed={handleTrashed}
        onReverted={handleMutate}
        characters={characterCount.characters()}
      />
      <PublishSettings
        open={openPublishSettings}
        content={content}
        onClose={() => setOpenPublishSettings(false)}
      />
      <Box component="main" sx={{ minHeight: '100vh' }}>
        <Toolbar sx={{ mt: 0 }} />
        <Container sx={{ py: 6 }}>
          <Box sx={{ maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto', mb: 6 }}>
            {content.title.length === 0 && content.body.length === 0 && content.canTranslate && (
              <Stack direction="row" gap={1} sx={{ mb: 4, alignItems: 'center' }} color="secondary">
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
                {isTranslating ? (
                  <>
                    <Box
                      width={64}
                      height={40}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <LoadingOutlined size={14} />
                    </Box>
                  </>
                ) : (
                  <Button
                    variant="text"
                    size="small"
                    color="secondary"
                    sx={{
                      width: 40,
                      height: 40,
                      textDecoration: 'underline',
                      textDecorationStyle: 'dotted',
                      textUnderlineOffset: '0.3rem',
                    }}
                    onClick={handleTranslate}
                  >
                    {t('i_do')}
                  </Button>
                )}
              </Stack>
            )}
            <Box sx={{ mb: 2 }}>
              {uploadCover ? (
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
              ) : (
                <Button variant="text" color="secondary" component="label">
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
            </Box>

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
                mb: 4,
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
          </Box>
          <BlockEditor editor={editor} />
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
