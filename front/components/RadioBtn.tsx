import React from 'react'
import { StyleSheet, TouchableOpacity, View, ViewStyle, TouchableOpacityProps } from 'react-native'
import { colors } from '@/utils/colors'

const DEFAULT_SIZE_MULTIPLIER = 0.7

interface RadioButtonProps extends Omit<TouchableOpacityProps, 'onPress'> {
  size?: number;
  innerColor?: string;
  outerColor?: string;
  isSelected?: boolean;
  onPress?: () => void;
}

const RadioButton: React.FC<RadioButtonProps> = (props) => {
  const {
    size = 16,
    innerColor = colors.radioColor,
    outerColor = colors.radioOuterColor,
    isSelected = false,
    onPress = () => null,
    style,
    ...restProps
  } = props

  const outerStyle: ViewStyle = {
    borderColor: isSelected ? outerColor : colors.fontThirdColor,
    width: size + size * DEFAULT_SIZE_MULTIPLIER,
    height: size + size * DEFAULT_SIZE_MULTIPLIER,
    borderRadius: (size + size * DEFAULT_SIZE_MULTIPLIER) / 2,
    borderWidth: isSelected ? size / 2 : 1
  }

  const innerStyle: ViewStyle = {
    width: size / 2,
    height: size / 2,
    borderRadius: size / 2,
    backgroundColor: innerColor
  }

  return (
    <TouchableOpacity 
      style={[styles.radio, outerStyle, style]} 
      onPress={onPress}
      {...restProps}
    >
      {isSelected ? <View style={innerStyle} /> : null}
    </TouchableOpacity>
  )
}

export default React.memo(RadioButton)

const styles = StyleSheet.create({
  radio: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  }
})