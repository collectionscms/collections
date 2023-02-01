import _ from 'lodash';
import React, { forwardRef } from 'react';

type ComposedWrappers<CW> = {
  [key in keyof CW]: React.FC<CW[key]>;
};

type ComposedWrapperProps<T extends {}, CW> = T & {
  [key in keyof CW]?: CW[key] & Partial<{ disable?: boolean }>;
} & Partial<{ unwrap?: boolean }>;

const ComposeWrapper = <CW,>(wrappers: ComposedWrappers<CW>) => {
  return function <T extends object, R>(Component: React.FC<T>) {
    return forwardRef<R, ComposedWrapperProps<T, CW>>(({ unwrap = false, ...allProps }, ref) => {
      const keys = Object.keys(wrappers).filter((k) => !allProps[k]?.disable);
      const props = _.omit(allProps, keys) as T;
      const restProps = _.pick(allProps, keys);

      if (unwrap || keys.length === 0) {
        return <Component {...props} ref={ref} />;
      }

      return (
        <>
          {keys.reduceRight((children, currentKey) => {
            const CurrentWrapper = wrappers[currentKey];
            const currentWrapperProps = restProps?.[currentKey] ?? {};

            return <CurrentWrapper {...currentWrapperProps}>{children}</CurrentWrapper>;
          }, <Component {...props} ref={ref} />)}
        </>
      );
    });
  };
};

export default ComposeWrapper;
