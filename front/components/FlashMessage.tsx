import { showMessage } from 'react-native-flash-message'
import PropTypes from 'prop-types'
import { textStyles,  } from '@/utils/textStyles'
import { alignment } from '@/utils/alignment'
import { StyleSheet, Dimensions } from 'react-native'


const { height } = Dimensions.get('window')

export const FlashMessage = (props: { message: any; type: any; position: any }) => {
  showMessage({
    message: props.message,
    type: props.type,
    position: props.position ?? 'top',
    floating: true,
    titleStyle: styles.text,
    style: styles.position
  })
}
FlashMessage.propTypes = {
  message: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
  text: {
    ...textStyles.H5,
    ...alignment.PTxSmall
  },
  position: {
    marginTop: height * 0.08
  }
})