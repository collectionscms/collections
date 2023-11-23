import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

type UnsavedPrompt = {
  showPrompt: boolean;
  proceed: () => void;
  stay: () => void;
};

export const useUnsavedChangesPrompt = (shouldBlock: boolean): UnsavedPrompt => {
  const blocker = useBlocker(shouldBlock);
  const showPrompt = blocker.state === 'blocked';

  const proceed = () => {
    blocker.proceed?.();
  };

  const stay = () => {
    blocker.reset?.();
  };

  useEffect(() => {
    if (showPrompt && !shouldBlock) {
      blocker.reset();
    }
  }, [blocker, showPrompt, shouldBlock]);

  return { showPrompt, proceed, stay };
};
