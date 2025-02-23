import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../../extensions/parts/Icon';
import { Button } from '../../../parts/Button';
import { Surface } from '../../../parts/Surface';
import { Toggle } from '../../../parts/Toggle';

type Props = {
  initialUrl?: string;
  initialOpenInNewTab?: boolean;
  onSetLink: (url: string, openInNewTab?: boolean) => void;
};

export const useLinkEditorState = ({ initialUrl, initialOpenInNewTab, onSetLink }: Props) => {
  const [url, setUrl] = useState(initialUrl || '');
  const [openInNewTab, setOpenInNewTab] = useState(initialOpenInNewTab || false);

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  }, []);

  const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isValidUrl) {
        onSetLink(url, openInNewTab);
      }
    },
    [url, isValidUrl, openInNewTab, onSetLink]
  );

  return {
    url,
    setUrl,
    openInNewTab,
    setOpenInNewTab,
    onChange,
    handleSubmit,
    isValidUrl,
  };
};

export const LinkEditorPanel = ({ initialUrl, initialOpenInNewTab, onSetLink }: Props) => {
  const { t } = useTranslation();
  const state = useLinkEditorState({ onSetLink, initialOpenInNewTab, initialUrl });

  return (
    <Surface className="p-2">
      <form onSubmit={state.handleSubmit} className="flex items-center gap-2">
        <label className="flex items-center gap-2 p-2 rounded-lg bg-neutral-100 cursor-text">
          <Icon name="Link" className="flex-none text-black " />
          <input
            type="url"
            className="flex-1 bg-transparent outline-none min-w-[12rem] text-black text-smwhite"
            placeholder="Enter URL"
            value={state.url}
            onChange={state.onChange}
          />
        </label>
        <Button variant="primary" buttonSize="small" type="submit" disabled={!state.isValidUrl}>
          {t('apply')}
        </Button>
      </form>
      <div className="mt-3">
        <label className="flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer select-none text-neutral-500 ">
          {t('open_in_new_tab')}
          <Toggle active={state.openInNewTab} onChange={state.setOpenInNewTab} />
        </label>
      </div>
    </Surface>
  );
};
