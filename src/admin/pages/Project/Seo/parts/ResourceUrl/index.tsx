import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreatableSelector } from '../../../.../../../../components/elements/CreatableSelector/index.js';

type Props = {
  initialUrls: string[];
  onChange: (initialUrls: string[]) => void;
};

export const ResourceUrl: React.FC<Props> = ({ initialUrls, onChange }) => {
  const { t } = useTranslation();
  const [urls, setUrls] = useState<string[]>(initialUrls);

  const options = initialUrls.map((url) => ({
    value: url,
    label: url,
  }));

  const inputtedValues = urls.map((url) => ({
    value: url,
    label: url,
  }));

  const handleValueChange = async (names: string[]) => {
    setUrls(names);
    onChange(names);
  };

  return (
    <CreatableSelector
      options={options}
      values={inputtedValues}
      placeholder={t('resource_url_placeholder')}
      onChange={handleValueChange}
    />
  );
};
