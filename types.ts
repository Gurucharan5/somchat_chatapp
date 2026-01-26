import React from "react";
import { TextInput, TextInputProps, TextProps, TextStyle, TouchableOpacityProps, ViewStyle } from "react-native";

export type ScreenWrapperProps = {
    style?: ViewStyle;
    children: React.ReactNode;
    isModal?: boolean;
    showPattern?: boolean;
    bgOpacity?: number;
}

export type TypoProps = {
    size?: number;
    color?: string;
    fontWeight?: TextStyle['fontWeight'];
    children: any | null;
    style?: TextStyle;
    textProps?: TextProps;
}

export interface ButtonProps extends TouchableOpacityProps {
    style?: ViewStyle;
    onPress?: () => void;
    loading?: boolean;
    children: React.ReactNode;
}


export type BackButtonProps = {
    style?: ViewStyle;
    color?: string;
    iconSize?: number;
}

export interface InputProps extends TextInputProps {
    icon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    inputRef?: React.RefObject<TextInput>;
    // label?: string;
    // error?: string;
}