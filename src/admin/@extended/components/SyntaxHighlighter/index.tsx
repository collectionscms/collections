import { useTheme } from '@mui/material';
import React from 'react';
import ReactSyntaxHighlighter from 'react-syntax-highlighter';
//@ts-ignore
import stackoverflowLight from 'react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-light.js';
//@ts-ignore
import stackoverflowDark from 'react-syntax-highlighter/dist/esm/styles/hljs/stackoverflow-dark.js';

type Props = {
  language: string;
  codeString: string;
};

export const SyntaxHighlighter: React.FC<Props> = ({ language, codeString }) => {
  const theme = useTheme();
  return (
    <ReactSyntaxHighlighter
      language={language}
      style={theme.palette.mode === 'light' ? stackoverflowLight : stackoverflowDark}
    >
      {codeString}
    </ReactSyntaxHighlighter>
  );
};
