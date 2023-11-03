type ChoiceFieldType = {
  id: string;
  label: string;
  value: string;
};

export type Props = {
  field: ChoiceFieldType;
  onEdit: (field: ChoiceFieldType) => void;
  onDelete: (id: string) => void;
};
