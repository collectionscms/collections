import { lazy } from 'react';

export default (resolver: () => any, name = 'default') => {
  return lazy(async () => {
    const resolved = await resolver();
    return { default: resolved[name] };
  });
};
