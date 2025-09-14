import React from 'react'
import { ActivityIndicator, ColorValue } from 'react-native'
import PropTypes from 'prop-types'
import { colors } from '@/utils/colors'

function Spinner(props: { loading: any; backColor: ColorValue | undefined; size: any; spinnerColor: ColorValue | undefined }) {
  return (
    <ActivityIndicator
      animating={props.loading ?? true}
      style={{
        flex: 1,
        backgroundColor: props.backColor
          ? props.backColor
          : colors.themeBackground
      }}
      size={props.size || 'large'}
      color={props.spinnerColor ? props.spinnerColor : colors.spinnerColor}
    />
  )
}
Spinner.propTypes = {
  backColor: PropTypes.string,
  spinnerColor: PropTypes.string,
  size: PropTypes.string
}
export default Spinner