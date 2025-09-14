import { scale } from './scaling'
import { fontStyles } from './fontStyles'
import { TextStyle } from 'react-native'

// eslint-disable-next-line import/prefer-default-export
export const textStyles = {
  H1: {
    fontSize: scale(35)
  },
  H2: {
    fontSize: scale(24)
  },
  H3: {
    fontSize: scale(20)
  },
  H4: {
    fontSize: scale(16)
  },
  H5: {
    fontSize: scale(14)
  },
  Normal: {
    fontSize: scale(12)
  },
  Small: {
    fontSize: scale(10)
  },
  Regular: {
    fontFamily: fontStyles.PoppinsRegular
  },
  Bold: {
    fontFamily: fontStyles.PoppinsBold
  },
  Center: {
    textAlign: 'center' as const 
  },
  Right: {
    textAlign: 'right' as const 
  },
  UpperCase: {
    textTransform: 'uppercase' as const 
  },
  LineOver: {
    textDecorationLine: 'line-through' as const 
  }
};