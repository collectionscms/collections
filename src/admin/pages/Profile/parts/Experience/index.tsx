import { useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Select, { MultiValue } from 'react-select';
import { ProjectWithExperiences } from '../../../../../types/index.js';
import { useColorMode } from '../../../../components/utilities/ColorMode/index.js';

type OptionType = {
  value: string;
  label: string;
};

type GroupedOptionType = {
  label: string;
  options: readonly OptionType[];
};

type Props = {
  options: ProjectWithExperiences[];
  values: MultiValue<OptionType>;
  onChange: (selectedOptions: OptionType[]) => void;
};

export const Experience: React.FC<Props> = ({ options, values, onChange }) => {
  const { t } = useTranslation();
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

  const groupedOptions = options.map((option) => ({
    label: option.name,
    options: option.experiences.map((experience) => ({
      label: experience.name,
      value: experience.id,
    })),
  }));

  return (
    <>
      <Select<OptionType, true, GroupedOptionType>
        options={groupedOptions}
        isMulti={true}
        value={values}
        onChange={(newValue) => onChange(newValue.map((v) => ({ label: v.label, value: v.value })))}
        placeholder={t('search_experiences')}
        unstyled={true}
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
          groupHeading: (styles) => ({
            ...styles,
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: 500,
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.background.paper,
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
      />
    </>
  );
};
