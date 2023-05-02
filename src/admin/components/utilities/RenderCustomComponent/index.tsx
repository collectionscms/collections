import React from 'react';
import { Props } from './types.js';

const RenderCustomComponent: React.FC<Props> = (props) => {
  const { CustomComponent, DefaultComponent, componentProps } = props;

  if (CustomComponent) {
    return <CustomComponent {...componentProps} />;
  }

  return <DefaultComponent {...componentProps} />;
};

export default RenderCustomComponent;
