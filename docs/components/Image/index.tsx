import React from 'react';

type Props = {
  imageUrl: string;
};

export const Image: React.FC<Props> = ({ imageUrl }) => {
  return (
    <p className="nx-mt-6 nx-leading-7 first:nx-mt-0">
      <img src={imageUrl} style={{ boxShadow: '0 0 6px #17294033', borderRadius: '4px' }} />
    </p>
  );
};
