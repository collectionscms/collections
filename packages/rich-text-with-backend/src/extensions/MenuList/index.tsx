import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Surface } from '../../parts/Surface.js';
import { DropdownButton } from '../parts/DropdownButton/index.js';
import { Icon } from '../parts/Icon/index.js';
import { Command, MenuListProps } from '../SlashCommand/groups.js';

export const MenuList = React.forwardRef((props: MenuListProps, ref) => {
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
    <Surface
      ref={scrollContainer}
      className="text-black max-h-[min(80vh,24rem)] overflow-auto flex-wrap mb-8 p-2"
    >
      <div className="flex flex-col gap-2">
        {props.items.map((group, groupIndex: number) => (
          <div key={`${group.title}`}>
            <p className="mx-1 mt-2 mb-0.5 tracking-wider first:mt-[0.125rem] text-xs text-gray-400">
              {group.title}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.commands.map((command: Command, commandIndex: number) => (
                <DropdownButton
                  key={`${command.label}`}
                  isActive={
                    selectedGroupIndex === groupIndex && selectedCommandIndex === commandIndex
                  }
                  onClick={createCommandClickHandler(groupIndex, commandIndex)}
                >
                  <div className="w-9 h-9 border border-gray-300 rounded flex items-center justify-center">
                    <Icon name={command.iconName} size={22} strokeWidth={2} />
                  </div>
                  <div className="ml-2 text-left">
                    <p>{command.label}</p>
                    <p className="text-xs text-gray-400">{command.description}</p>
                  </div>
                </DropdownButton>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Surface>
  );
});

MenuList.displayName = 'MenuList';
