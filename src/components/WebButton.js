import React from 'react';
import { Platform } from 'react-native';

export default function WebButton({ onPress, style, children }) {
  if (Platform.OS === 'web') {
    return (
      <div
        onClick={onPress}
        style={{
          ...style,
          cursor: 'pointer',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row'
        }}
      >
        {children}
      </div>
    );
  }
  
  return (
    <Pressable style={style} onPress={onPress}>
      {children}
    </Pressable>
  );
}