export type Props = {
  openState: boolean;
  collectionId: string;
  field: string;
  excludes: Partial<{ id: number }>[];
  onSuccess: (contents: Partial<{ id: number }>[]) => void;
  onClose: () => void;
};
