import React, { Suspense } from 'react';
import Loading from '../Loading';

const Loader = (Component: React.ComponentType, props?: any) =>
  function Loader() {
    return (
      <Suspense fallback={<Loading />}>
        <Component {...props} />
      </Suspense>
    );
  };

export default Loader;
