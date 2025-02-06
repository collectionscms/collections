import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreatableSelector } from '../../../../components/elements/CreatableSelector/index.js';

type Props = {
  optionAwards: string[];
  initialAwards: string[];
  onChange: (awards: string[]) => void;
};

export const Award: React.FC<Props> = ({ optionAwards, initialAwards, onChange }) => {
  const { t } = useTranslation();

  const options = optionAwards.map((award) => ({
    value: award,
    label: award,
  }));

  const values = initialAwards.map((award) => ({
    value: award,
    label: award,
  }));

  return (
    <CreatableSelector
      options={options}
      values={values}
      placeholder={t('award_placeholder')}
      onChange={onChange}
    />
  );
};
