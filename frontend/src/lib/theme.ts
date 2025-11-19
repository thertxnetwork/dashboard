'use client';

import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#0D5C47' : '#10875F',
      light: mode === 'light' ? '#10875F' : '#12A474',
      dark: mode === 'light' ? '#094335' : '#062D23',
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'light' ? '#6B8E7F' : '#A8D5BA',
      light: mode === 'light' ? '#A8D5BA' : '#D1E8D9',
      dark: mode === 'light' ? '#4A6B5E' : '#6B8E7F',
    },
    success: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    warning: {
      main: '#F57C00',
      light: '#FF9800',
      dark: '#E65100',
    },
    error: {
      main: '#C62828',
      light: '#E53935',
      dark: '#B71C1C',
    },
    info: {
      main: '#1565C0',
      light: '#1976D2',
      dark: '#0D47A1',
    },
    background: {
      default: mode === 'light' ? '#F8F9F8' : '#0A1F1A',
      paper: mode === 'light' ? '#ffffff' : '#0F2E26',
    },
    text: {
      primary: mode === 'light' ? '#252928' : '#E8EBE9',
      secondary: mode === 'light' ? '#626B67' : '#B0B8B4',
    },
    divider: mode === 'light' ? '#E8EBE9' : '#3F4643',
    action: {
      hover: mode === 'light' ? 'rgba(13, 92, 71, 0.04)' : 'rgba(168, 213, 186, 0.08)',
      selected: mode === 'light' ? 'rgba(13, 92, 71, 0.08)' : 'rgba(168, 213, 186, 0.16)',
      disabled: mode === 'light' ? 'rgba(0, 0, 0, 0.26)' : 'rgba(255, 255, 255, 0.3)',
      disabledBackground: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
      focus: mode === 'light' ? 'rgba(13, 92, 71, 0.12)' : 'rgba(168, 213, 186, 0.12)',
    },
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: 14,
    h1: {
      fontSize: '2rem', // 32px
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.25rem', // 20px
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1rem', // 16px
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '0.875rem', // 14px
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem', // 16px
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem', // 12px
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
    },
  },
  spacing: 8, // 8px base unit
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          borderRadius: 8,
          boxShadow: 'none',
          transition: 'all 200ms ease-in-out',
          '&:hover': {
            boxShadow: 'none',
            transform: 'scale(1.02)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
        sizeSmall: {
          padding: '6px 16px',
          minHeight: '32px',
        },
        sizeMedium: {
          padding: '8px 20px',
          minHeight: '40px',
        },
        sizeLarge: {
          padding: '12px 24px',
          minHeight: '48px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: mode === 'light' ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' : mode === 'dark' ? '0 0 0 1px rgba(168, 213, 186, 0.05)' : 'none',
          transition: 'all 200ms ease-in-out',
          '&:hover': {
            boxShadow: mode === 'light' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : mode === 'dark' ? '0 0 0 1px rgba(168, 213, 186, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.3)' : 'none',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: mode === 'light' ? '#ffffff' : '#0F2E26',
          height: '64px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: mode === 'light' ? '#ffffff' : '#0F2E26',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            fontSize: '0.875rem',
            minHeight: '44px',
          },
          '& .MuiInputBase-input': {
            padding: '12px 14px',
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: mode === 'light' ? 'rgba(13, 92, 71, 0.3)' : 'rgba(168, 213, 186, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: mode === 'light' ? '#0D5C47' : '#10875F',
              borderWidth: '2px',
              outline: '3px solid',
              outlineColor: mode === 'light' ? 'rgba(13, 92, 71, 0.1)' : 'rgba(168, 213, 186, 0.1)',
              outlineOffset: '0px',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          borderRadius: 8,
        },
        input: {
          padding: '12px 14px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          padding: '14px 16px',
          borderBottom: mode === 'light' ? '1px solid rgba(0, 0, 0, 0.06)' : '1px solid rgba(255, 255, 255, 0.06)',
        },
        head: {
          fontWeight: 600,
          fontSize: '0.8125rem',
          color: mode === 'light' ? '#626B67' : '#B0B8B4',
          backgroundColor: mode === 'light' ? '#F8F9F8' : '#0A1F1A',
          borderBottom: mode === 'light' ? '2px solid rgba(0, 0, 0, 0.08)' : '2px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 150ms ease-in-out',
          '&:hover': {
            backgroundColor: mode === 'light' ? 'rgba(13, 92, 71, 0.02)' : 'rgba(168, 213, 186, 0.02)',
          },
          '&:nth-of-type(odd)': {
            backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.01)' : 'rgba(255, 255, 255, 0.01)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
          height: '26px',
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
          transition: 'all 200ms ease-in-out',
          '&.Mui-selected': {
            backgroundColor: mode === 'light' ? 'rgba(13, 92, 71, 0.08)' : 'rgba(168, 213, 186, 0.12)',
            borderLeft: '4px solid',
            borderLeftColor: mode === 'light' ? '#0D5C47' : '#10875F',
            paddingLeft: '12px',
            '&:hover': {
              backgroundColor: mode === 'light' ? 'rgba(13, 92, 71, 0.12)' : 'rgba(168, 213, 186, 0.16)',
            },
          },
          '&:hover': {
            backgroundColor: mode === 'light' ? 'rgba(13, 92, 71, 0.04)' : 'rgba(168, 213, 186, 0.04)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 200ms ease-in-out',
          '&:hover': {
            backgroundColor: mode === 'light' ? 'rgba(13, 92, 71, 0.08)' : 'rgba(168, 213, 186, 0.08)',
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: mode === 'light' ? '#252928' : '#E8EBE9',
          color: mode === 'light' ? '#E8EBE9' : '#252928',
          fontSize: '0.75rem',
          borderRadius: 6,
          padding: '8px 12px',
        },
      },
    },
  },
});
