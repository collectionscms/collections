export type Props = {
  collection: string;
  field: string;
  openState: boolean;
  onSuccess: (content: Partial<{ id: number }>) => void;
  onClose: () => void;
};
