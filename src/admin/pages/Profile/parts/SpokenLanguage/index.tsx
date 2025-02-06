import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreatableSelector } from '../../../../components/elements/CreatableSelector/index.js';

type Props = {
  optionLanguages: string[];
  initialLanguages: string[];
  onChange: (initialLanguages: string[]) => void;
};

export const SpokenLanguage: React.FC<Props> = ({
  optionLanguages,
  initialLanguages,
  onChange,
}) => {
  const { t } = useTranslation();

  const options = optionLanguages.map((language) => ({
    value: language,
    label: language,
  }));

  const values = initialLanguages.map((language) => ({
    value: language,
    label: language,
  }));

  return (
    <CreatableSelector
      options={options}
      values={values}
      placeholder={t('spoken_languages_placeholder')}
      onChange={onChange}
    />
  );
};
