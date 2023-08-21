import dayjs from 'dayjs';
import { DateHelper } from '../types.js';

export class DateHelperMySQL extends DateHelper {
  writeTimestamp(date: string): string {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  }
}
