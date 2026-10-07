import { GENDER_OPTIONS, SIGNUP_STEPS, UPLOAD_IMAGE_STEPS } from '@/constants';
import {
  ImageProps,
  ImageStyle,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

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

export interface AppImageProps extends Omit<ImageProps, 'style'> {
  style?: StyleProp<ImageStyle>;
}

export type Step = (typeof SIGNUP_STEPS)[keyof typeof SIGNUP_STEPS];
export type ImageStep = (typeof UPLOAD_IMAGE_STEPS)[keyof typeof UPLOAD_IMAGE_STEPS];

export type Gender = (typeof GENDER_OPTIONS)[keyof typeof GENDER_OPTIONS];

export interface CountryOption {
  code: string;
  dialCode: string;
  name: string;
}
