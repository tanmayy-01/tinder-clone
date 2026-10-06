import { AppImageProps } from '@/types';
import React from 'react';
import { 
  Image as RNImage, 
} from 'react-native';

const AppImage: React.FC<AppImageProps> = ({
  source,
  style,
  resizeMode = 'contain', 
  ...restProps
}) => {
  return (
    <RNImage
      source={source}
      style={style}
      resizeMode={resizeMode}
      {...restProps}
    />
  );
};

export default AppImage;