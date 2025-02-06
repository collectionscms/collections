import { useTheme } from '@mui/material';
import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { useColorMode } from '../../utilities/ColorMode/index.js';

type Props = {
  options: Record<string, string>[];
  values: Record<string, string>[];
  placeholder: string;
  onChange: (names: string[]) => void;
};

export const CreatableSelector: React.FC<Props> = ({ options, values, placeholder, onChange }) => {
  const { mode } = useColorMode();
  const theme = useTheme();
  const color =
    mode === 'dark'
      ? {
          controlBgColor: theme.palette.grey[200],
          menuBgColor: theme.palette.grey[100],
          valueBgColor: theme.palette.grey[200],
        }
      : {
          controlBgColor: theme.palette.grey[300],
          menuBgColor: theme.palette.grey[50],
          valueBgColor: theme.palette.grey[300],
        };

  const handleValueChange = (value: Record<string, string>[]) => {
    onChange(value.map((v) => v.value));
  };

  return (
    <CreatableSelect
      isMulti
      options={options}
      value={values}
      unstyled={true}
      placeholder={placeholder}
      onChange={(value) =>
        handleValueChange(
          value.map((v) => {
            return { value: v.value, label: v.label };
          })
        )
      }
      styles={{
        control: (styles) => ({
          ...styles,
          border: '1px solid ' + color.controlBgColor,
          borderRadius: 4,
          padding: 9,
          '&:hover': {
            borderColor: theme.palette.primary.light,
            boxShadow: 'none',
            cursor: 'text',
          },
        }),
        menuList: (styles) => ({
          ...styles,
          marginTop: 8,
          borderRadius: 4,
          border: '1px solid ' + color.controlBgColor,
        }),
        indicatorsContainer: (styles) => ({
          ...styles,
          cursor: 'pointer',
        }),
        indicatorSeparator: (styles) => ({
          ...styles,
          margin: '0 8px',
          backgroundColor: color.controlBgColor,
        }),
        option: (styles) => ({
          ...styles,
          padding: '6px 10px',
          backgroundColor: color.menuBgColor,
          '&:hover': {
            backgroundColor: theme.palette.grey[200],
            cursor: 'pointer',
          },
        }),
        noOptionsMessage: (styles) => ({
          ...styles,
          color: theme.palette.text.secondary,
          backgroundColor: color.menuBgColor,
          padding: '8px 0',
        }),
        valueContainer: (styles) => ({
          ...styles,
          gap: 6,
        }),
        placeholder: (styles) => ({
          ...styles,
          color: theme.palette.text.secondary,
        }),
        multiValue: (styles) => ({
          ...styles,
          backgroundColor: color.valueBgColor,
          padding: '0 6px',
          borderRadius: 3,
        }),
        multiValueRemove: (styles) => ({
          ...styles,
          marginLeft: 4,
          '&:hover': {
            cursor: 'pointer',
          },
        }),
      }}
      menuPosition="fixed"
    />
  );
};
