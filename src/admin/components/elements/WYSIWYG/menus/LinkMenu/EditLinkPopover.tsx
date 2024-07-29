import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Popover,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { t } from 'i18next';
import { Link, Trash2 } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

type Props = {
  anchorEl: HTMLButtonElement | null;
  shouldShow: boolean;
  initialUrl?: string;
  initialOpenInNewTab?: boolean;
  onSetLink: (link: string, openInNewTab?: boolean) => void;
  onRemoveLink: () => void;
  onClose: () => void;
};

export const EditLinkPopover: React.FC<Props> = ({
  anchorEl,
  shouldShow,
  initialUrl,
  initialOpenInNewTab,
  onSetLink,
  onRemoveLink,
  onClose,
}) => {
  const [url, setUrl] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(false);

  useEffect(() => {
    setUrl(initialUrl || '');
    setOpenInNewTab(initialOpenInNewTab || false);
  }, [initialUrl, initialOpenInNewTab]);

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

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        sx={{ mt: 2 }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 1 }}>
          <form onSubmit={handleSubmit}>
            <Stack direction="row" gap={1}>
              <TextField
                type="text"
                fullWidth
                size="small"
                placeholder="https://..."
                InputProps={{
                  startAdornment: <Link size={16} />,
                }}
                value={url}
                onChange={onChange}
              />
              <Button variant="contained" type="submit" size="small">
                {t('add')}
              </Button>
            </Stack>
            <FormControl component="fieldset" sx={{ px: 1, pt: 1 }}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      checked={openInNewTab}
                      size="small"
                      onChange={(e) => setOpenInNewTab(Boolean(e.target.checked))}
                    />
                  }
                  label={t('open_in_new_tab')}
                  labelPlacement="end"
                />
              </FormGroup>
            </FormControl>
          </form>
        </Box>
        <Divider />
        {shouldShow && (
          <Box sx={{ p: 1 }}>
            <Button
              variant="text"
              size="small"
              color="inherit"
              startIcon={
                <>
                  <Trash2 size={16} strokeWidth={1.5} />
                </>
              }
              onClick={onRemoveLink}
            >
              {t('remove_link')}
            </Button>
          </Box>
        )}
      </Popover>
    </>
  );
};
