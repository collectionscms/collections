import React, { Suspense } from 'react';
import Loading from '../Loading';

const Loader = (Component: React.ComponentType) =>
  function Loader(props: JSX.IntrinsicAttributes) {
    return (
      <Suspense fallback={<Loading />}>
        <Component {...props} />
      </Suspense>
    );
  };

export default Loader;
