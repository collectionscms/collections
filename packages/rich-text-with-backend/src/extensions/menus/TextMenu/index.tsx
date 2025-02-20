import { Paper } from '@mui/material';
import { BubbleMenu, Editor } from '@tiptap/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTextMenuCommands } from '../../../hooks/useTextMenuCommands';
import { useTextMenuStates } from '../../../hooks/useTextMenuStates';
import { Toolbar } from '../../../parts/Toolbar';
import { Icon } from '../../parts/Icon';
import { ToolbarButton } from '../../parts/ToolbarButton';
import { EditLinkPopover } from './EditLinkPopover';

type Props = {
  editor: Editor;
};

export const TextMenu: React.FC<Props> = ({ editor }) => {
  const { t } = useTranslation();
  const commands = useTextMenuCommands(editor);
  const states = useTextMenuStates(editor);

  const getBackgroundColor = (isActive: boolean) => {
    return isActive ? '#eee' : 'transparent';
  };

  return (
    <BubbleMenu
      className="bubble-menu"
      tippyOptions={{ maxWidth: 'none', popperOptions: { placement: 'top-start' } }}
      editor={editor}
      shouldShow={states.shouldShow}
      updateDelay={100}
    >
      <Paper
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          paddingY: 0.5,
          paddingX: 1,
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 6px 0px',
        }}
      >
        <div className="flex flex-row gap-0.5 items-center">
          <ToolbarButton
            tooltip={`${t('editor.bold')}`}
            shortcuts={['Mod', 'B']}
            color="inherit"
            sx={{ backgroundColor: getBackgroundColor(editor.isActive('bold')) }}
            onClick={commands.onBold}
          >
            <Icon name="Bold" size={16} />
          </ToolbarButton>
          <ToolbarButton
            tooltip={`${t('editor.italic')}`}
            shortcuts={['Mod', 'I']}
            color="inherit"
            sx={{ backgroundColor: getBackgroundColor(editor.isActive('italic')) }}
            onClick={commands.onItalic}
          >
            <Icon name="Italic" size={16} />
          </ToolbarButton>

          <ToolbarButton
            tooltip={`${t('editor.underline')}`}
            shortcuts={['Mod', 'U']}
            color="inherit"
            sx={{ backgroundColor: getBackgroundColor(editor.isActive('underline')) }}
            onClick={commands.onUnderline}
          >
            <Icon name="Underline" size={16} />
          </ToolbarButton>
          <ToolbarButton
            tooltip={`${t('editor.strike_through')}`}
            shortcuts={['Mod', 'Shift', 'S']}
            color="inherit"
            sx={{ backgroundColor: getBackgroundColor(editor.isActive('strike')) }}
            onClick={commands.onStrike}
          >
            <Icon name="Strikethrough" size={16} />
          </ToolbarButton>
          <Toolbar.Divider />
          <ToolbarButton
            tooltip={`${t('editor.heading')}`}
            color="inherit"
            sx={{ backgroundColor: getBackgroundColor(editor.isActive('heading', { level: 1 })) }}
            onClick={commands.onHeading}
          >
            <Icon name="Heading1" size={16} />
          </ToolbarButton>
          <ToolbarButton
            tooltip={`${t('editor.subheading')}`}
            color="inherit"
            sx={{ backgroundColor: getBackgroundColor(editor.isActive('heading', { level: 2 })) }}
            onClick={commands.onSubheading}
          >
            <Icon name="Heading2" size={16} />
          </ToolbarButton>
          <ToolbarButton
            tooltip={`${t('editor.subtitle')}`}
            color="inherit"
            sx={{ backgroundColor: getBackgroundColor(editor.isActive('heading', { level: 3 })) }}
            onClick={commands.onSubtitle}
          >
            <Icon name="Heading3" size={16} />
          </ToolbarButton>
          <Toolbar.Divider />
          <ToolbarButton
            tooltip={`${t('editor.code')}`}
            shortcuts={['Mod', 'E']}
            color="inherit"
            sx={{ backgroundColor: getBackgroundColor(editor.isActive('code')) }}
            onClick={commands.onCode}
          >
            <Icon name="Code" size={16} />
          </ToolbarButton>
          <EditLinkPopover onSetLink={commands.onLink} />
        </div>
      </Paper>
    </BubbleMenu>
  );
};
