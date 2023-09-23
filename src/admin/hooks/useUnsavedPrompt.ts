import { useEffect } from 'react';
import { unstable_useBlocker as useBlocker } from 'react-router-dom';

type UnsavedPrompt = {
  showPrompt: boolean;
  discard: () => void;
  keep: () => void;
};

export const useUnsavedPrompt = (shouldBlock: boolean): UnsavedPrompt => {
  const blocker = useBlocker(shouldBlock);
  const showPrompt = blocker.state === 'blocked';

  const discard = () => {
    blocker.proceed?.();
  };

  const keep = () => {
    blocker.reset?.();
  };

  useEffect(() => {
    if (showPrompt && !shouldBlock) {
      blocker.reset();
    }
  }, [blocker, showPrompt, shouldBlock]);

  return { showPrompt, discard, keep };
};
