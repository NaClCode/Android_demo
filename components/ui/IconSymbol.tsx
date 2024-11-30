import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

/**
 * An icon component that directly uses MaterialIcons.
 *
 * Icon `name`s are passed directly as MaterialIcons names.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>; // 修改为 TextStyle 类型
}) {
  return <MaterialIcons color={color} size={size} name={name} style={style} />;
}
