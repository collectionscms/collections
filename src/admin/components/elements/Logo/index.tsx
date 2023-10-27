/* eslint-disable max-len */
import React from 'react';
import { useColorMode } from '../../utilities/ColorMode/index.js';

export const Logo: React.FC = () => {
  return <DefaultLogo />;
};

const DefaultLogo: React.FC = () => {
  const { mode } = useColorMode();
  return mode === 'light' ? logoLight : logoDark;
};

const logoDark = (
  <svg
    viewBox="0 0 280 438"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      width: '100%',
      height: '100%',
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinejoin: 'round',
      strokeMiterlimit: 2,
    }}
  >
    <g transform="matrix(4.16667,0,0,4.16667,131.25,18.75)">
      <path
        d="M0,25.5L-4.5,20L9,-4.5L35.5,27.5L34,30L0,25.5Z"
        style={{
          fill: 'rgb(255,255,255)',
          fillRule: 'nonzero',
        }}
      />
    </g>
    <g transform="matrix(-4.13675,-0.498404,-0.498404,4.13675,35.4145,227.786)">
      <path
        d="M-53.108,-23.188L-11.308,-23.188L-1.332,2.691L-42.696,3.248L-53.108,-23.188Z"
        style={{
          fill: 'rgb(255,255,255)',
          fillRule: 'nonzero',
        }}
      />
    </g>
    <g transform="matrix(4.16667,0,0,4.16667,27.0833,437.5)">
      <path
        d="M0,-43.5L-6.5,-32L20,0L34,-25L20.5,-41L0,-43.5Z"
        style={{
          fill: 'rgb(255,255,255)',
          fillRule: 'nonzero',
        }}
      />
    </g>
  </svg>
);

const logoLight = (
  <svg
    viewBox="0 0 280 438"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    style={{
      width: '100%',
      height: '100%',
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinejoin: 'round',
      strokeMiterlimit: 2,
    }}
  >
    <g transform="matrix(4.16667,0,0,4.16667,131.25,18.75)">
      <path
        d="M0,25.5L-4.5,20L9,-4.5L35.5,27.5L34,30L0,25.5Z"
        style={{
          fill: 'rgb(35,31,32)',
          fillRule: 'nonzero',
        }}
      />
    </g>
    <g transform="matrix(-4.13675,-0.498404,-0.498404,4.13675,35.4145,227.786)">
      <path
        d="M-53.108,-23.188L-11.308,-23.188L-1.332,2.691L-42.696,3.248L-53.108,-23.188Z"
        style={{
          fill: 'rgb(35,31,32)',
          fillRule: 'nonzero',
        }}
      />
    </g>
    <g transform="matrix(4.16667,0,0,4.16667,27.0833,437.5)">
      <path
        d="M0,-43.5L-6.5,-32L20,0L34,-25L20.5,-41L0,-43.5Z"
        style={{
          fill: 'rgb(35,31,32)',
          fillRule: 'nonzero',
        }}
      />
    </g>
  </svg>
);
