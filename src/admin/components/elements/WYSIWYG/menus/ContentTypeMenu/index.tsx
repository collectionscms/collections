import { Button, Paper, Stack } from '@mui/material';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { CaseSensitive, ChevronDown, icons } from 'lucide-react';
import React, { useMemo } from 'react';

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
              const Icon = icons[option.icon];

              return (
                <Dropdown.Item key={option.id}>
                  <Button
                    variant="text"
                    color="secondary"
                    onClick={option.onClick}
                    sx={{ justifyContent: 'left', width: '100%' }}
                  >
                    <Stack direction="row" alignItems="center" gap={1}>
                      {option.icon && <Icon size={16} />}
                      {option.label}
                    </Stack>
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
