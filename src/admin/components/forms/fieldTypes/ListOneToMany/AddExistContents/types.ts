export type Props = {
  openState: boolean;
  collection: string;
  field: string;
  excludes: Partial<{ id: number }>[];
  onSuccess: (contents: Partial<{ id: number }>[]) => void;
  onClose: () => void;
};
