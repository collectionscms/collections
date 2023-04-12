import { InputType as input } from './Input';
import { InputMultilineType as inputMultiline } from './InputMultiline';
import { SelectDropdownType as selectDropdown } from './SelectDropdown';
import { SelectDropdownType as selectDropdownStatus } from './SelectDropdown';
import { Props } from './types';

export type FieldTypes = {
  input: React.ComponentType<Props>;
  inputMultiline: React.ComponentType<Props>;
  selectDropdown: React.ComponentType<Props>;
  selectDropdownStatus: React.ComponentType<Props>;
};

const fieldTypes: FieldTypes = {
  input,
  inputMultiline,
  selectDropdown,
  selectDropdownStatus,
};

export default fieldTypes;
