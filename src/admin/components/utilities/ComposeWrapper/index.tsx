import React, { forwardRef } from 'react';
import { pick } from '../../../../utilities/pick.js';

type ComposedWrappers<CW> = {
  [key in keyof CW]: React.FC<CW[key]>;
};

type ComposedWrapperProps<T extends {}, CW> = T & {
  [key in keyof CW]?: CW[key] & Partial<{ disable?: boolean }>;
} & Partial<{ unwrap?: boolean }>;

function omit(obj: any, ...keys: string[][]) {
  const keysToRemove = new Set(keys.flat());
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !keysToRemove.has(k)));
}

export const ComposeWrapper = <CW,>(wrappers: ComposedWrappers<CW>) => {
  return function <T extends object, R>(Component: React.FC<T>) {
    // eslint-disable-next-line react/display-name
    return forwardRef<R, ComposedWrapperProps<T, CW>>(({ unwrap = false, ...allProps }, ref) => {
      const keys = Object.keys(wrappers).filter((k) => !allProps[k as keyof CW]?.disable);
      const props = omit(allProps, keys) as T;
      const restProps = pick(allProps, keys);

      if (unwrap || keys.length === 0) {
        return <Component {...props} ref={ref} />;
      }

      return (
        <>
          {keys.reduceRight(
            (children, currentKey) => {
              const CurrentWrapper = wrappers[currentKey as keyof CW];
              const currentWrapperProps = restProps?.[currentKey] ?? {};

              return <CurrentWrapper {...currentWrapperProps}>{children}</CurrentWrapper>;
            },
            <Component {...props} ref={ref} />
          )}
        </>
      );
    });
  };
};
