import dayjs from 'dayjs';
import { DatabaseHelper } from '../types.js';

export type AbstractDateHelper = {
  readTimestampString(date: string): string;
  writeTimestamp(date: string): string;
};

export abstract class DateHelper extends DatabaseHelper implements AbstractDateHelper {
  readTimestampString(date: string): string {
    return date;
  }

  writeTimestamp(date: string): string {
    return dayjs(date).toISOString();
  }

  fieldFlagForField(fieldInterface: string): string {
    switch (fieldInterface) {
      case 'dateTime':
        return 'cast-timestamp';
      default:
        return '';
    }
  }
}
