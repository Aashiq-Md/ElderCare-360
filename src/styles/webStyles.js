import { Platform } from 'react-native';

export const webContainerStyle = {
  ...(Platform.OS === 'web' && {
    maxWidth: 400,
    alignSelf: 'center',
    minHeight: '100vh',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)'
  })
};

export const webScrollStyle = {
  ...(Platform.OS === 'web' && {
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none'
  })
};