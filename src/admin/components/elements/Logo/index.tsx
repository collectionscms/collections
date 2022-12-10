import RenderCustomComponent from '@admin/components/utilities/RenderCustomComponent';
import React from 'react';

const css = `
  .graphic-logo path {
    fill: #000;
  }
`;

const DefaultLogo: React.FC = () => {
  return (
    <svg
      width="90"
      height="25"
      viewBox="0 0 180 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="graphic-logo"
    >
      <style>{css}</style>
      <path d="M19.1531 0L42.049 13.8019V39.9956L24.8049 50V23.8064L1.89795 10.0155L19.1531 0Z" />
      <path d="M17.4097 48.5454V28.1035L0.132324 38.1301L17.4097 48.5454Z" />
    </svg>
  );
};

const Logo: React.FC = () => {
  return <RenderCustomComponent CustomComponent={undefined} DefaultComponent={DefaultLogo} />;
};

export default Logo;
