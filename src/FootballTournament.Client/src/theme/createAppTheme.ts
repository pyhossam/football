import { createTheme, alpha } from '@mui/material/styles';

export function createAppTheme(direction: 'rtl' | 'ltr') {
  return createTheme({
    direction,
    palette: {
      mode: 'light',
      primary: {
        main: '#0b6b4f',
        light: '#24a978',
        dark: '#063f33',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#d6a536',
        light: '#f0ca69',
        dark: '#8c6512',
        contrastText: '#111510',
      },
      error: {
        main: '#c43f3f',
      },
      background: {
        default: '#f4f7f2',
        paper: '#ffffff',
      },
      text: {
        primary: '#14211b',
        secondary: '#597066',
      },
    },
    typography: {
      fontFamily:
        direction === 'rtl'
          ? '"Cairo", "Segoe UI", Tahoma, Arial, sans-serif'
          : 'Inter, "Segoe UI", Arial, sans-serif',
      h1: {
        fontWeight: 900,
        letterSpacing: 0,
      },
      h2: {
        fontWeight: 850,
        letterSpacing: 0,
      },
      h3: {
        fontWeight: 800,
        letterSpacing: 0,
      },
      h4: {
        fontWeight: 800,
        letterSpacing: 0,
      },
      h5: {
        fontWeight: 780,
        letterSpacing: 0,
      },
      h6: {
        fontWeight: 760,
        letterSpacing: 0,
      },
      button: {
        fontWeight: 800,
        textTransform: 'none',
        letterSpacing: 0,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            minHeight: 42,
            borderRadius: 8,
            boxShadow: 'none',
          },
          containedPrimary: {
            backgroundImage: 'linear-gradient(135deg, #0b6b4f, #168b65)',
            boxShadow: `0 12px 30px ${alpha('#0b6b4f', 0.22)}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: `0 16px 50px ${alpha('#1b352b', 0.08)}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            backgroundColor: '#ffffff',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 800,
          },
        },
      },
    },
  });
}
