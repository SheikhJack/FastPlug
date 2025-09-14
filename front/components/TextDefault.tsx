import React from 'react'
import { Text, StyleSheet, TextStyle, StyleProp, TextProps } from 'react-native'
import { textStyles } from '@/utils/textStyles'
import { colors } from '@/utils'

interface TextDefaultProps extends TextProps {
  bold?: boolean;
  center?: boolean;
  right?: boolean;
  small?: boolean;
  H5?: boolean;
  H4?: boolean;
  H3?: boolean;
  H2?: boolean;
  H1?: boolean;
  uppercase?: boolean;
  lineOver?: boolean;
  textColor?: string;
}

function TextDefault(props: TextDefaultProps) {
  const {
    bold,
    center,
    right,
    small,
    H5,
    H4,
    H3,
    H2,
    H1,
    uppercase,
    lineOver,
    textColor: customTextColor,
    style,
    onPress,
    numberOfLines = 0,
    children,
    ...restProps
  } = props

  const styleArray: StyleProp<TextStyle>[] = [
    { color: customTextColor ?? colors.textColor },
    textStyles.Regular,
    textStyles.Normal,
  ]

  if (bold) styleArray.push(textStyles.Bold)
  if (center) styleArray.push(textStyles.Center)
  if (right) styleArray.push(textStyles.Right)
  if (small) styleArray.push(textStyles.Small)
  if (H5) styleArray.push(textStyles.H5)
  if (H4) styleArray.push(textStyles.H4)
  if (H3) styleArray.push(textStyles.H3)
  if (H2) styleArray.push(textStyles.H2)
  if (H1) styleArray.push(textStyles.H1)
  if (uppercase) styleArray.push(textStyles.UpperCase)
  if (lineOver) styleArray.push(textStyles.LineOver)

  if (style) styleArray.push(style)

  const combinedStyle = StyleSheet.flatten(styleArray)

  return (
    <Text
      onPress={onPress}
      numberOfLines={numberOfLines}
      style={combinedStyle}
      {...restProps}
    >
      {children}
    </Text>
  )
}

export default TextDefault