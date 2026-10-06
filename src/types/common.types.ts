import { StyleProp, TextInputProps, TextStyle, ViewStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'social' | 'outline';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  leftIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  activeOpacity?: number;
}

export interface HeaderProps {
  onBackPress?: () => void;
  showBack?: boolean;
}

export interface AppIconProps {
  name: string;
  size?: number;
  color?: string;
}

export interface UnderlineInputProps extends TextInputProps {
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}
