import {
  BoldOutlined,
  FileImageOutlined,
  FullscreenOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  StrikethroughOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { SvgIconTypeMap, Tooltip } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { ICommand, commands as mdCommands } from '@uiw/react-md-editor';
import React, { ComponentClass, FunctionComponent } from 'react';
import { IconButton } from 'superfast-ui';

type OverrideIcon =
  | (OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
      muiName: string;
    })
  | ComponentClass<any>
  | FunctionComponent<any>;

const CommandButton = (props: { title: string; icon: OverrideIcon; onClick: () => void }) => (
  <Tooltip title={props.title} arrow placement="top">
    <IconButton
      style={{ margin: 3, width: '28px', height: '28px', fontSize: 16 }}
      onClick={props.onClick}
    >
      <props.icon />
    </IconButton>
  </Tooltip>
);

const bold = (title: string): ICommand => ({
  ...mdCommands.bold,
  render: (command, _, executeCommand) => (
    <CommandButton
      title={title}
      icon={BoldOutlined}
      onClick={() => executeCommand(command, command.groupName)}
    />
  ),
});

const italic = (title: string): ICommand => ({
  ...mdCommands.italic,
  render: (command, _, executeCommand) => (
    <CommandButton
      title={title}
      icon={ItalicOutlined}
      onClick={() => executeCommand(command, command.groupName)}
    />
  ),
});

const strikethrough = (title: string): ICommand => ({
  ...mdCommands.strikethrough,
  render: (command, _, executeCommand) => (
    <CommandButton
      title={title}
      icon={StrikethroughOutlined}
      onClick={() => executeCommand(command, command.groupName)}
    />
  ),
});

const unorderedList = (title: string): ICommand => ({
  ...mdCommands.unorderedListCommand,
  render: (command, _, executeCommand) => (
    <CommandButton
      title={title}
      icon={UnorderedListOutlined}
      onClick={() => executeCommand(command, command.groupName)}
    />
  ),
});

const orderedList = (title: string): ICommand => ({
  ...mdCommands.orderedListCommand,
  render: (command, _, executeCommand) => (
    <CommandButton
      title={title}
      icon={OrderedListOutlined}
      onClick={() => executeCommand(command, command.groupName)}
    />
  ),
});

const link = (title: string): ICommand => ({
  ...mdCommands.link,
  render: (command, _, executeCommand) => (
    <CommandButton
      title={title}
      icon={LinkOutlined}
      onClick={() => executeCommand(command, command.groupName)}
    />
  ),
});

const image = (title: string): ICommand => ({
  ...mdCommands.image,
  render: (command, _, executeCommand) => (
    <CommandButton
      title={title}
      icon={FileImageOutlined}
      onClick={() => executeCommand(command, command.groupName)}
    />
  ),
});

const fullScreen = (title: string): ICommand => ({
  ...mdCommands.fullscreen,
  render: (command, _, executeCommand) => (
    <CommandButton
      title={title}
      icon={FullscreenOutlined}
      onClick={() => executeCommand(command, command.groupName)}
    />
  ),
});

export type CommandTypes = {
  bold(title: string): ICommand;
  italic(title: string): ICommand;
  strikethrough(title: string): ICommand;
  unorderedList(title: string): ICommand;
  orderedList(title: string): ICommand;
  link(title: string): ICommand;
  image(title: string): ICommand;
  fullScreen(title: string): ICommand;
};

export const commands: CommandTypes = {
  bold,
  italic,
  strikethrough,
  unorderedList,
  orderedList,
  link,
  image,
  fullScreen,
};
