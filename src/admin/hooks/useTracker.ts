import * as amplitude from '@amplitude/analytics-browser';
import { useEffect } from 'react';

const useTracker = () => {
  useEffect(() => {
    const apiKey = process.env.PUBLIC_AMPLITUDE_API_KEY;
    if (apiKey) {
      amplitude.init(apiKey, {
        autocapture: true,
      });
    }
  }, []);

  const setUserId = (userId: string) => {
    amplitude.setUserId(userId);
  };

  const trackEvent = (eventName: string, eventProperties: Record<string, any>) => {
    amplitude.track(eventName, eventProperties);
  };

  return { setUserId, trackEvent };
};

export default useTracker;
