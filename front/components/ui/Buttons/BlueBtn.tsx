import React from 'react'
import { View, TouchableOpacity, Text, GestureResponderEvent } from 'react-native'
import  Spinner  from '@/components/Spinner'
import { blueBtn as styles } from './styles'
import { colors } from '@/utils/colors'

/* Config/Constants
============================================================================= */

/* =============================================================================
<MainBtn />
Blue btn used. Height is fixed, width is adaptable. If have to force width, set width of the parent container.
It appears this one is a bit smaller than others so i have its height a bit lower
--------------------------------------------------------------------------------

Props:
  ?
  onPress Event: send the function to be called for onPress event
  text: send the Text for button
============================================================================= */

const BlueBtn = (props: { loading: any; onPress: ((event: GestureResponderEvent) => void) | undefined; text: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined }) => (
  <View style={styles.backgroundColor}>
    {props.loading ? (
      <Spinner backColor="rgba(0,0,0,0.1)" spinnerColor={colors.white} loading={true} size={'Large'} />
    ) : (
      <TouchableOpacity
        activeOpacity={0}
        onPress={props.onPress}
        style={styles.main_blue_btn}>
        <Text style={styles.btn_text}> {props.text} </Text>
      </TouchableOpacity>
    )}
  </View>
)

export default BlueBtn
