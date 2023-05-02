import React, { Suspense } from 'react';
import { Loading } from '../Loading/index.js';

export const Loader = (Component: React.ComponentType, props?: any) =>
  function Loader() {
    return (
      <Suspense fallback={<Loading />}>
        <Component {...props} />
      </Suspense>
    );
  };
