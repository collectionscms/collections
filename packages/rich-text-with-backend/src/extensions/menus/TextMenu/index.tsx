import { BubbleMenu, Editor } from '@tiptap/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTextMenuCommands } from '../../../hooks/useTextMenuCommands';
import { useTextMenuStates } from '../../../hooks/useTextMenuStates';
import { Toolbar } from '../../../parts/Toolbar';
import { Icon } from '../../parts/Icon';
import { EditLinkPopover } from './EditLinkPopover';

type Props = {
  editor: Editor;
};

export const TextMenu: React.FC<Props> = ({ editor }) => {
  const { t } = useTranslation();
  const commands = useTextMenuCommands(editor);
  const states = useTextMenuStates(editor);

  return (
    <BubbleMenu
      className="bubble-menu"
      tippyOptions={{ maxWidth: 'none', popperOptions: { placement: 'top-start' } }}
      editor={editor}
      shouldShow={states.shouldShow}
      updateDelay={0}
    >
      <Toolbar.Wrapper>
        <Toolbar.Button
          tooltip={`${t('editor.bold')}`}
          tooltipShortcut={['Mod', 'B']}
          onClick={commands.onBold}
          active={states.isBold}
        >
          <Icon name="Bold" size={16} />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip={`${t('editor.italic')}`}
          tooltipShortcut={['Mod', 'I']}
          onClick={commands.onItalic}
          active={states.isItalic}
        >
          <Icon name="Italic" size={16} />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip={`${t('editor.underline')}`}
          tooltipShortcut={['Mod', 'U']}
          onClick={commands.onUnderline}
          active={states.isUnderline}
        >
          <Icon name="Underline" size={16} />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip={`${t('editor.strike_through')}`}
          tooltipShortcut={['Mod', 'Shift', 'S']}
          onClick={commands.onStrike}
          active={states.isStrike}
        >
          <Icon name="Strikethrough" size={16} />
        </Toolbar.Button>
        <Toolbar.Divider />
        <Toolbar.Button
          tooltip={`${t('editor.heading')}`}
          onClick={commands.onHeading}
          active={states.isHeading}
        >
          <Icon name="Heading1" size={16} />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip={`${t('editor.heading')}`}
          onClick={commands.onSubheading}
          active={states.isSubHeading}
        >
          <Icon name="Heading2" size={16} />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip={`${t('editor.subtitle')}`}
          onClick={commands.onSubtitle}
          active={states.isSubTitle}
        >
          <Icon name="Heading3" size={16} />
        </Toolbar.Button>
        <Toolbar.Divider />
        <Toolbar.Button
          tooltip={`${t('editor.code')}`}
          tooltipShortcut={['Mod', 'E']}
          onClick={commands.onCode}
          active={states.isSubTitle}
        >
          <Icon name="Code" size={16} />
        </Toolbar.Button>
        <EditLinkPopover onSetLink={commands.onLink} />
      </Toolbar.Wrapper>
    </BubbleMenu>
  );
};
