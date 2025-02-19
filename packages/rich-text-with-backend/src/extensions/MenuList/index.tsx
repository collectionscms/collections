import { Box, Paper, Typography, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DropdownButton } from '../parts/DropdownButton/index.js';
import { Icon } from '../parts/Icon/index.js';
import { Command, MenuListProps } from '../SlashCommand/groups.js';

export const MenuList = React.forwardRef((props: MenuListProps, ref) => {
  const theme = useTheme();
  const scrollContainer = useRef<HTMLDivElement>(null);
  const activeItem = useRef<HTMLButtonElement>(null);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

  useEffect(() => {
    setSelectedGroupIndex(0);
    setSelectedCommandIndex(0);
  }, [props.items]);

  const selectItem = useCallback(
    (groupIndex: number, commandIndex: number) => {
      const command = props.items[groupIndex].commands[commandIndex];
      props.command(command);
    },
    [props]
  );

  React.useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: React.KeyboardEvent }) => {
      if (event.key === 'ArrowDown') {
        if (!props.items.length) {
          return false;
        }

        const commands = props.items[selectedGroupIndex].commands;

        let newCommandIndex = selectedCommandIndex + 1;
        let newGroupIndex = selectedGroupIndex;

        if (commands.length - 1 < newCommandIndex) {
          newCommandIndex = 0;
          newGroupIndex = selectedGroupIndex + 1;
        }

        if (props.items.length - 1 < newGroupIndex) {
          newGroupIndex = 0;
        }

        setSelectedCommandIndex(newCommandIndex);
        setSelectedGroupIndex(newGroupIndex);

        return true;
      }

      if (event.key === 'ArrowUp') {
        if (!props.items.length) {
          return false;
        }

        let newCommandIndex = selectedCommandIndex - 1;
        let newGroupIndex = selectedGroupIndex;

        if (newCommandIndex < 0) {
          newGroupIndex = selectedGroupIndex - 1;
          newCommandIndex = props.items[newGroupIndex]?.commands.length - 1 || 0;
        }

        if (newGroupIndex < 0) {
          newGroupIndex = props.items.length - 1;
          newCommandIndex = props.items[newGroupIndex].commands.length - 1;
        }

        setSelectedCommandIndex(newCommandIndex);
        setSelectedGroupIndex(newGroupIndex);

        return true;
      }

      if (event.key === 'Enter') {
        if (!props.items.length || selectedGroupIndex === -1 || selectedCommandIndex === -1) {
          return false;
        }

        selectItem(selectedGroupIndex, selectedCommandIndex);

        return true;
      }

      return false;
    },
  }));

  useEffect(() => {
    if (activeItem.current && scrollContainer.current) {
      const offsetTop = activeItem.current.offsetTop;
      const offsetHeight = activeItem.current.offsetHeight;

      scrollContainer.current.scrollTop = offsetTop - offsetHeight;
    }
  }, [selectedCommandIndex, selectedGroupIndex]);

  const createCommandClickHandler = useCallback(
    (groupIndex: number, commandIndex: number) => {
      return () => {
        selectItem(groupIndex, commandIndex);
      };
    },
    [selectItem]
  );

  if (!props.items.length) {
    return null;
  }

  return (
    <Paper
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        overflowY: 'auto',
        maxHeight: 'min(80vh, 20rem)',
        flexWrap: 'wrap',
        marginBottom: 2,
        p: 1,
        width: 300,
        boxShadow: '0px 9px 24px rgba(0, 0, 0, 0.1)',
      }}
      ref={scrollContainer}
    >
      <div className="flex flex-col gap-2">
        {props.items.map((group, groupIndex: number) => (
          <div key={`${group.title}`}>
            <Typography
              variant="subtitle2"
              color={theme.palette.text.secondary}
              sx={{
                mx: 1,
                mb: 0.5,
                mt: 2,
                letterSpacing: '0.05em',
                '&:first-of-type': {
                  marginTop: '0.125rem',
                },
              }}
            >
              {group.title}
            </Typography>
            <div className="flex flex-col gap-0.5">
              {group.commands.map((command: Command, commandIndex: number) => (
                <DropdownButton
                  key={`${command.label}`}
                  isActive={
                    selectedGroupIndex === groupIndex && selectedCommandIndex === commandIndex
                  }
                  onClick={createCommandClickHandler(groupIndex, commandIndex)}
                >
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      display: 'flex',
                    }}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon name={command.iconName} size={22} strokeWidth={2} />
                  </Box>
                  <div className="ml-2 text-left">
                    <Typography>{command.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {command.description}
                    </Typography>
                  </div>
                </DropdownButton>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Paper>
  );
});

MenuList.displayName = 'MenuList';
