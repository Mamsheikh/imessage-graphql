import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { StepsStyleConfig as Steps } from 'chakra-ui-steps';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const theme = extendTheme(
  { config },
  {
    colors: {
      brand: {
        100: '#3D84F7',
      },
    },
    styles: {
      global: () => ({
        body: {
          bg: 'whiteAlpha.200',
        },
      }),
    },
    components: {
      Steps,
    },
  }
);
