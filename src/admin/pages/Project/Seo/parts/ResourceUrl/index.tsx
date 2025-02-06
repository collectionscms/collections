import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreatableSelector } from '../../../.../../../../components/elements/CreatableSelector/index.js';

type Props = {
  optionUrls: string[];
  initialUrls: string[];
  onChange: (initialUrls: string[]) => void;
};

export const ResourceUrl: React.FC<Props> = ({ optionUrls, initialUrls, onChange }) => {
  const { t } = useTranslation();

  const options = optionUrls.map((url) => ({
    value: url,
    label: url,
  }));

  const values = initialUrls.map((url) => ({
    value: url,
    label: url,
  }));

  return (
    <CreatableSelector
      options={options}
      values={values}
      placeholder={t('resource_url_placeholder')}
      onChange={onChange}
    />
  );
};
