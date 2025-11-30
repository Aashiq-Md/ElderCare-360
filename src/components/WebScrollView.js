import React from 'react';
import { Platform, ScrollView, View } from 'react-native';

export default function WebScrollView({ children, style, contentContainerStyle }) {
  if (Platform.OS === 'web') {
    return (
      <View style={[{
        minHeight: '100vh',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: '50px'
      }, style]}>
        <View style={contentContainerStyle}>
          {children}
        </View>
      </View>
    );
  }
  
  return (
    <ScrollView style={style} contentContainerStyle={contentContainerStyle}>
      {children}
    </ScrollView>
  );
}