import React from 'react';
import {
  default as Head,
  default as Html,
  default as Main,
  default as NextScript,
} from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
