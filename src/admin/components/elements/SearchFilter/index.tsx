import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { FormControl, IconButton, OutlinedInput } from '@mui/material';
import queryString from 'qs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Props } from './types';

const SearchFilter: React.FC<Props> = ({ fieldName, fieldLabel }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [previousSearch, setPreviousSearch] = useState('');
  const [composing, setComposition] = useState(false);

  const handleStartComposition = () => setComposition(true);
  const handleEndComposition = () => setComposition(false);

  const handleKeyDown = (key: string) => {
    switch (key) {
      case 'Enter':
        if (composing || search === previousSearch) break;
        setPreviousSearch(search);
        const q = queryString.stringify({ page: 1, q: { [fieldName]: search } });
        navigate({ search: q });
        break;
    }
  };

  return (
    <FormControl fullWidth>
      <OutlinedInput
        size="small"
        id="search-filter"
        endAdornment={
          <IconButton type="button" aria-label="search">
            <SearchOutlinedIcon />
          </IconButton>
        }
        aria-describedby="search-filter-text"
        placeholder={t('search_by', { field_name: fieldLabel })}
        sx={{ p: 0.5 }}
        value={search || ''}
        onCompositionStart={handleStartComposition}
        onCompositionEnd={handleEndComposition}
        onKeyDown={(e) => handleKeyDown(e.key)}
        onChange={(e) => setSearch(e.target.value)}
      />
    </FormControl>
  );
};

export default SearchFilter;
