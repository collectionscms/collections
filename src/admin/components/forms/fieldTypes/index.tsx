import { BooleanType as boolean } from './Boolean';
import { DateTimeType as dateTime } from './DateTime';
import { InputType as input } from './Input';
import { InputMultilineType as inputMultiline } from './InputMultiline';
import {
  SelectDropdownType as selectDropdown,
  SelectDropdownType as selectDropdownStatus,
} from './SelectDropdown';
import { Props } from './types';

export type FieldTypes = {
  input: React.ComponentType<Props>;
  inputMultiline: React.ComponentType<Props>;
  selectDropdown: React.ComponentType<Props>;
  selectDropdownStatus: React.ComponentType<Props>;
  boolean: React.ComponentType<Props>;
  dateTime: React.ComponentType<Props>;
};

const fieldTypes: FieldTypes = {
  input,
  inputMultiline,
  selectDropdown,
  selectDropdownStatus,
  boolean,
  dateTime,
};

export default fieldTypes;
