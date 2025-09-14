import React from 'react'
import { View, TouchableOpacity, Text, GestureResponderEvent } from 'react-native'
import { alternateBtn as styles } from './styles'

/* Config/Constants
============================================================================= */

/* =============================================================================
<TextField />
A TextInput covered by a white background View, greyish border, black text. has 100% width and mod scale 38 height.
--------------------------------------------------------------------------------

Props:
  ?
  onPress Event: send the function to be called for onPress event
  text: send the Text for button
============================================================================= */
const MainBtn = (props: { onPress: ((event: GestureResponderEvent) => void) | undefined; text: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined }) => (
  <View style={styles.backgroundColor}>
    <TouchableOpacity
      activeOpacity={0}
      onPress={props.onPress}
      style={styles.main_alt_btn}>
      <Text style={styles.btn_text}> {props.text} </Text>
    </TouchableOpacity>
  </View>
)

export default MainBtn
