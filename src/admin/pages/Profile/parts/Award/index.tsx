import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreatableSelector } from '../../../../components/elements/CreatableSelector/index.js';

type Props = {
  initialAwards: string[];
  onChange: (awards: string[]) => void;
};

export const Award: React.FC<Props> = ({ initialAwards, onChange }) => {
  const { t } = useTranslation();
  const [awards, setAwards] = useState<string[]>(initialAwards);

  const options = initialAwards.map((award) => ({
    value: award,
    label: award,
  }));

  const inputtedValues = awards.map((award) => ({
    value: award,
    label: award,
  }));

  const handleValueChange = async (names: string[]) => {
    setAwards(names);
    onChange(names);
  };

  return (
    <CreatableSelector
      options={options}
      values={inputtedValues}
      placeholder={t('award_placeholder')}
      onChange={handleValueChange}
    />
  );
};
