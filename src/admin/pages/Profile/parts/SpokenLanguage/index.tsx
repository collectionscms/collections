import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreatableSelector } from '../../../../components/elements/CreatableSelector/index.js';

type Props = {
  initialLanguages: string[];
  onChange: (initialLanguages: string[]) => void;
};

export const SpokenLanguage: React.FC<Props> = ({ initialLanguages, onChange }) => {
  const { t } = useTranslation();
  const [languages, setLanguages] = useState<string[]>(initialLanguages);

  const options = initialLanguages.map((language) => ({
    value: language,
    label: language,
  }));

  const inputtedValues = languages.map((language) => ({
    value: language,
    label: language,
  }));

  const handleValueChange = async (names: string[]) => {
    setLanguages(names);
    onChange(names);
  };

  return (
    <CreatableSelector
      options={options}
      values={inputtedValues}
      placeholder={t('spoken_languages_placeholder')}
      onChange={handleValueChange}
    />
  );
};
