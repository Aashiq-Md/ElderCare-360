import { Platform, Dimensions } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

export const getResponsiveStyle = () => {
  const { width } = Dimensions.get('window');
  const isMobileWeb = isWeb && width <= 768;
  
  return {
    container: {
      flex: 1,
      maxWidth: isMobileWeb ? '100%' : 400,
      alignSelf: 'center',
      backgroundColor: '#fff',
    },
    scrollView: {
      flex: 1,
      ...(isWeb && {
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }),
    },
  };
};