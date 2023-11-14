import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import React from 'react';

type CopyToClipboardProps = {
  value: (() => Promise<string | null>) | string | null;
};
export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ value }) => {
  const [copied, setCopied] = React.useState(false);
  const ref = React.useRef<any>(null);

  const copy = React.useCallback(async () => {
    if (ref && ref.current && value) {
      const copyValue = typeof value === 'string' ? value : await value();
      if (!copyValue) return;

      ref.current.value = copyValue;
      ref.current.select();
      ref.current.setSelectionRange(0, copyValue.length + 1);
      await navigator.clipboard.writeText(copyValue);

      setCopied(true);
    }
  }, [value]);

  React.useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 500);
    }
  }, [copied]);

  return (
    <button onClick={copy} className="pl-3">
      {copied ? (
        <CheckOutlined className="text-green-400 align-middle" />
      ) : (
        <CopyOutlined className="text-gray-400 align-middle" />
      )}
      <textarea className="opacity-0 w-1 h-1 absolute" tabIndex={-1} readOnly ref={ref} />
    </button>
  );
};
