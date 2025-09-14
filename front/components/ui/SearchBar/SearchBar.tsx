import React from 'react'
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleProp, 
  ViewStyle,
  TextInputProps
} from 'react-native'
import { colors, scale, alignment, textStyles } from '@/utils'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
}

function SearchBar(props: SearchBarProps) {
  const { 
    onPress, 
    containerStyle,
    inputStyle,
    buttonStyle,
    placeholder = "Search...",
    placeholderTextColor = colors.primaryBlackColor,
    ...textInputProps 
  } = props;

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.textfield, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        {...textInputProps}
      />
      <TouchableOpacity
        style={[styles.button, buttonStyle]}
        activeOpacity={0.7}
        onPress={onPress}>
        <Ionicons
          name="search"
          size={scale(25)}
          color={colors.buttonBackground}
        />
      </TouchableOpacity>
    </View>
  )
}

export default SearchBar

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroudGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderRadius: scale(5),
    height: scale(40),
  },
  button: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    ...alignment.PLxSmall,
    ...alignment.PRxSmall,
    ...alignment.MRxSmall,
    minWidth: scale(40),
  },
  textfield: {
    ...textStyles.Regular,
    ...textStyles.H5,
    ...alignment.PLsmall,
    flex: 1,
    color: colors.primaryBlackColor,
  }
})