import {
  createMuiTheme,
  Theme as MaterialTheme,
} from '@material-ui/core/styles';

const muiTheme: MaterialTheme = createMuiTheme({
  typography: {
    fontFamily: '"Noto Sans KR"',
  },
  overrides: {},
  palette: {
    primary: {
      light: '#fdd108',
      main: '#fcc30b',
      dark: '#ffbc00',
    },
  },
});

export const nxvTheme = {
  ...muiTheme,
  color: {
    'nxv-yellow': '#fdd108',
    'nxv-yellow-w-bg': '#fcc30b',
    'nxv-down-yellow': '#ffbc00',
    'nxv-gray': '#f5f3f2',
    'nxv-charcol': '#262626',
    'nxv-black': '#000000',
  },
  breakPoint: {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px',
  },
};

export type NxvTheme = typeof nxvTheme;
