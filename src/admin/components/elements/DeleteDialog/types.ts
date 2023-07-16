type Action = {
  action: () => void;
  label: string;
};

export type Props = {
  open: boolean;
  title: string;
  body: string;
  confirm: Action;
  cancel: Action;
};
