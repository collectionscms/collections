import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { castToBoolean } from '../../../../utilities/castToBoolean.js';
import { Props } from './types.js';

export const Cell: React.FC<Props> = (props) => {
  const { colIndex, type, cellData } = props;
  const { t } = useTranslation();
  dayjs.extend(utc);

  const truncate = (value: string) => {
    const MAX_LENGTH = 50;
    return value.length > MAX_LENGTH ? value.substring(0, MAX_LENGTH) + '...' : value;
  };

  const sanitizedCellData: any = () => {
    if (colIndex === 0 && (cellData === null || String(cellData).trim() === '')) {
      return 'No data';
    }

    switch (type.fieldType) {
      case 'text' || 'number':
        return cellData && truncate(String(cellData));
      case 'date':
        return cellData && dayjs(String(cellData)).local().format(t('date_format.long'));
      case 'boolean':
        return castToBoolean(cellData) ? t('enabled') : t('disabled');
      case 'object':
        return truncate(JSON.stringify(cellData));
      case 'array':
        const data = cellData as Partial<{ id: string }>[];
        const ids = data.map((item) => item).join(', ');
        return ids;
      default:
        return '';
    }
  };

  return <span>{sanitizedCellData()}</span>;
};
