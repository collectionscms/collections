import { CopyOutlined } from '@ant-design/icons';
import { Box, CardActions, Collapse, Tooltip } from '@mui/material';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { IconButton } from '../IconButton/index.js';
import { SyntaxHighlighter } from '../SyntaxHighlighter/index.js';

type Props = {
  language: string;
  codeString: string;
  codeHighlight: boolean;
};

const Highlighter: React.FC<Props> = ({ language, codeString, codeHighlight }) => {
  return (
    <>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Box sx={{ display: 'flex' }}>
          <CopyToClipboard text={codeString}>
            <Tooltip title="Copy" placement="top-end">
              <IconButton color="secondary" size="small" sx={{ fontSize: '0.875rem' }}>
                <CopyOutlined />
              </IconButton>
            </Tooltip>
          </CopyToClipboard>
        </Box>
      </CardActions>
      <Collapse in={codeHighlight}>
        {codeHighlight && <SyntaxHighlighter language={language} codeString={codeString} />}
      </Collapse>
    </>
  );
};

export default Highlighter;
