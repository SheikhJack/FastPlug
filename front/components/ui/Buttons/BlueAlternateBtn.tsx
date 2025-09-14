import React from 'react'
import { 
  View, 
  TouchableOpacity, 
  Text, 
  GestureResponderEvent, 
  StyleProp, 
  ViewStyle 
} from 'react-native'
import { alternateBlueBtn as styles } from './styles'

interface BlueBtnProps {
  onPress?: (event: GestureResponderEvent) => void;
  text: string;
  containerStyles?: StyleProp<ViewStyle>;
}

const BlueBtn: React.FC<BlueBtnProps> = (props) => (
  <View style={[styles.backgroundColor, props.containerStyles]}>
    <TouchableOpacity
      activeOpacity={0.7} // Changed from 0 to 0.7 for better UX
      onPress={props.onPress}
      style={styles.main_blue_btn}>
      <Text style={styles.btn_text}> 
        {props.text} 
      </Text>
    </TouchableOpacity>
  </View>
)

export default BlueBtn