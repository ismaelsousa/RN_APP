/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {TextProps} from 'react-native';
import {ColorsType, TypographyType} from 'styled-components';

export interface Props extends TextProps {
  children: string | React.ReactNode;
  color?: ColorsType;
  typography?: TypographyType;
}
