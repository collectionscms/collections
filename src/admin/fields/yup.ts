import * as _yup from 'yup';
import { locale } from './locale.js';

_yup.setLocale(locale);

export const yup = _yup;
