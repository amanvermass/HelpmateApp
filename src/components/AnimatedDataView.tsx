import React from 'react';
import { View, ViewProps } from 'react-native';

interface AnimatedDataViewProps extends ViewProps {
  children: React.ReactNode;
  delay?: number;
}

export const AnimatedDataView: React.FC<AnimatedDataViewProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
};
