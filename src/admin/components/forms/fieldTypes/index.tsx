import { BooleanType as boolean } from './Boolean/index.js';
import { DateTimeType as dateTime } from './DateTime/index.js';
import { InputType as input } from './Input/index.js';
import { InputMultilineType as inputMultiline } from './InputMultiline/index.js';
import { InputRichTextMdType as inputRichTextMd } from './InputRichTextMd/index.js';
import {
  SelectDropdownType as selectDropdown,
  SelectDropdownType as selectDropdownStatus,
} from './SelectDropdown/index.js';
import { Props } from './types.js';

export type FieldTypes = {
  input: React.ComponentType<Props>;
  inputMultiline: React.ComponentType<Props>;
  inputRichTextMd: React.ComponentType<Props>;
  selectDropdown: React.ComponentType<Props>;
  selectDropdownStatus: React.ComponentType<Props>;
  boolean: React.ComponentType<Props>;
  dateTime: React.ComponentType<Props>;
};

export const fieldTypes: FieldTypes = {
  input,
  inputMultiline,
  inputRichTextMd,
  selectDropdown,
  selectDropdownStatus,
  boolean,
  dateTime,
};
