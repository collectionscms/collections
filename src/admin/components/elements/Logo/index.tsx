import RenderCustomComponent from '@admin/components/utilities/RenderCustomComponent';
import { useTheme } from '@mui/material';
import React from 'react';

const DefaultLogo: React.FC = () => {
  const theme = useTheme();

  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      xmlns="http://www.w3.org/2000/svg"
      className="graphic-icon"
    >
      <style>
        {`
          .graphic-logo path {
            fill: ${theme.palette.text.primary};
          }
        `}
      </style>
      <path d="M11.5293 0L23 6.90096V19.9978L14.3608 25V11.9032L2.88452 5.00777L11.5293 0Z" />
      <path d="M10.6559 24.2727V14.0518L2 19.0651L10.6559 24.2727Z" />
    </svg>
  );
};

const Logo: React.FC = () => {
  return <RenderCustomComponent CustomComponent={undefined} DefaultComponent={DefaultLogo} />;
};

export default Logo;
