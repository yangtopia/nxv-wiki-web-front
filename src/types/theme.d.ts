/* eslint-disable @typescript-eslint/no-empty-interface */
import 'styled-components';
import { NxvTheme } from '../styles/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends NxvTheme {}
}
