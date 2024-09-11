import { yupResolver } from '@hookform/resolvers/yup';
import { FormHelperText, Stack } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { languages } from '../../../../constants/languages.js';
import { LocalizedContent } from '../../../../types/index.js';
import { logger } from '../../../../utilities/logger.js';
import { LanguageAutocomplete } from '../../../components/elements/LanguageAutocomplete/index.js';
import { ModalDialog } from '../../../components/elements/ModalDialog/index.js';
import { FormValues, addContent } from '../../../fields/validators/post/addContent.js';
import { usePost } from '../Context/index.js';

export type Props = {
  open: boolean;
  content: LocalizedContent;
  onClose: () => void;
  onAdded: (contentId: string, language: string) => void;
};

export const AddLanguage: React.FC<Props> = ({ open, content, onClose, onAdded }) => {
  const { createContent } = usePost();
  const { t } = useTranslation();
  const { trigger: createContentTrigger } = createContent(content.postId);
  const enabledLanguages = languages.filter(
    (language) => !content.usedLanguages.some((ul) => ul.language === language.code)
  );

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      language: '',
    },
    resolver: yupResolver(addContent()),
  });

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      const content = await createContentTrigger(form);
      onAdded(content.id, content.language);
      enqueueSnackbar(t('toast.created_successfully'), {
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
    <ModalDialog
      open={open}
      title={t('add_language_content')}
      body={
        <form>
          <Stack spacing={1} direction="column" sx={{ width: 400 }}>
            <LanguageAutocomplete
              languages={enabledLanguages}
              onChange={(_event, newValue) => {
                setValue('language', newValue === null ? '' : newValue.code);
              }}
            />
            <FormHelperText error>{errors.language?.message}</FormHelperText>
          </Stack>
        </form>
      }
      execute={{
        action: handleSubmit(onSubmit),
        label: t('add_to'),
      }}
      cancel={{
        action: onClose,
        label: t('cancel'),
      }}
      disabled={enabledLanguages.length === 0}
    />
  );
};
