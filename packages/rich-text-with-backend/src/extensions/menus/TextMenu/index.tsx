import { BubbleMenu, Editor } from '@tiptap/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { EditLinkPopover } from '../../../extensions/menus/TextMenu/EditLinkPopover';
import { Icon } from '../../../extensions/parts/Icon';
import { useTextMenuCommands } from '../../../hooks/useTextMenuCommands';
import { useTextMenuStates } from '../../../hooks/useTextMenuStates';
import { Toolbar } from '../../../parts/Toolbar';

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
          <Icon name="Bold" />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip={`${t('editor.italic')}`}
          tooltipShortcut={['Mod', 'I']}
          onClick={commands.onItalic}
          active={states.isItalic}
        >
          <Icon name="Italic" />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip={`${t('editor.underline')}`}
          tooltipShortcut={['Mod', 'U']}
          onClick={commands.onUnderline}
          active={states.isUnderline}
        >
          <Icon name="Underline" />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip={`${t('editor.strike_through')}`}
          tooltipShortcut={['Mod', 'Shift', 'S']}
          onClick={commands.onStrike}
          active={states.isStrike}
        >
          <Icon name="Strikethrough" />
        </Toolbar.Button>
        <Toolbar.Divider />
        <Toolbar.Button
          tooltip={`${t('editor.heading')}`}
          onClick={commands.onHeading}
          active={states.isHeading}
        >
          <Icon name="Heading1" />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip={`${t('editor.subheading')}`}
          onClick={commands.onSubheading}
          active={states.isSubHeading}
        >
          <Icon name="Heading2" />
        </Toolbar.Button>
        <Toolbar.Button
          tooltip={`${t('editor.subtitle')}`}
          onClick={commands.onSubtitle}
          active={states.isSubTitle}
        >
          <Icon name="Heading3" />
        </Toolbar.Button>
        <Toolbar.Divider />
        <Toolbar.Button
          tooltip={`${t('editor.code')}`}
          tooltipShortcut={['Mod', 'E']}
          onClick={commands.onCode}
          active={states.isCode}
        >
          <Icon name="Code" />
        </Toolbar.Button>
        <EditLinkPopover onSetLink={commands.onLink} />
      </Toolbar.Wrapper>
    </BubbleMenu>
  );
};
