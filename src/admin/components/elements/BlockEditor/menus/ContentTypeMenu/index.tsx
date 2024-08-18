import { IconButton, Paper, Stack, Typography } from '@mui/material';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { icons } from 'lucide-react';
import React, { useMemo } from 'react';
import { Icon } from '../../../Icon/index.js';
import { DropdownButton } from '../../ui/DropdownButton/index.js';

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
  const activeItemIcon = activeItem ? activeItem.icon : 'Pilcrow';

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <IconButton size="small" sx={{ px: 3, borderRadius: 1.5 }} color="inherit">
          <Stack gap={0.5} direction="row" alignItems="center">
            <Icon name={activeItemIcon} size={16} />
            <Icon name="ChevronDown" size={8} />
          </Stack>
        </IconButton>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Paper
          sx={{
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            padding: 1,
            boxShadow: '0px 9px 24px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Stack>
            {options.map((option) => {
              return (
                <DropdownButton onClick={option.onClick} key={option.id}>
                  <Icon name={option.icon} size={16} />
                  <Typography sx={{ ml: 1 }}>{option.label}</Typography>
                </DropdownButton>
              );
            })}
          </Stack>
        </Paper>
      </Dropdown.Content>
    </Dropdown.Root>
  );
};
