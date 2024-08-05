import { Button, Paper, Stack } from '@mui/material';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { CaseSensitive, ChevronDown, icons } from 'lucide-react';
import React, { useMemo } from 'react';
import { Icon } from '../../../Icon/index.js';

export type ContentTypePickerOption = {
  label: string;
  id: string;
  disabled: () => boolean;
  isActive: () => boolean;
  onClick: () => void;
  icon: keyof typeof icons;
};

type Props = {
  options: Array<ContentTypePickerOption>;
};

export const ContentTypeMenu: React.FC<Props> = ({ options }) => {
  const activeItem = useMemo(() => options.find((option) => option.isActive()), [options]);
  const ActiveItemIcon = activeItem ? icons[activeItem.icon] : CaseSensitive;

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button variant="text" color="secondary">
          <Stack gap={0.5} direction="row" alignItems="center">
            <ActiveItemIcon size={16} />
            <ChevronDown size={8} />
          </Stack>
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Paper elevation={1} sx={{ p: 1, borderRadius: 2 }}>
          <Stack>
            {options.map((option) => {
              return (
                <Dropdown.Item key={option.id}>
                  <Button
                    variant="text"
                    color="secondary"
                    onClick={option.onClick}
                    startIcon={<Icon name={option.icon} size={16} />}
                    sx={{ justifyContent: 'left', width: '100%' }}
                  >
                    {option.label}
                  </Button>
                </Dropdown.Item>
              );
            })}
          </Stack>
        </Paper>
      </Dropdown.Content>
    </Dropdown.Root>
  );
};
