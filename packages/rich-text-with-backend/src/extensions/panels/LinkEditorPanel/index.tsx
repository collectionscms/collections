import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Paper,
  Switch,
  TextField,
} from '@mui/material';
import { t } from 'i18next';
import React, { useCallback, useMemo, useState } from 'react';
import { Icon } from '../../parts/Icon';

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
  const state = useLinkEditorState({ onSetLink, initialOpenInNewTab, initialUrl });

  return (
    <Paper
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        p: 1,
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 6px 0px',
      }}
    >
      <form onSubmit={state.handleSubmit}>
        <div className="flex flex-row gap-1">
          <TextField
            type="text"
            fullWidth
            size="small"
            placeholder="https://..."
            InputProps={{
              startAdornment: <Icon name="Link" size={16} />,
            }}
            value={state.url}
            onChange={state.onChange}
          />
          <Button variant="contained" type="submit" size="small">
            {t('apply')}
          </Button>
        </div>
        <FormControl component="fieldset" sx={{ px: 1, pt: 1 }}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={state.openInNewTab}
                  size="small"
                  onChange={(e) => state.setOpenInNewTab(Boolean(e.target.checked))}
                />
              }
              label={t('open_in_new_tab')}
              labelPlacement="end"
            />
          </FormGroup>
        </FormControl>
      </form>
    </Paper>
  );
};
