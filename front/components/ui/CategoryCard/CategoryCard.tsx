import TextDefault from '@/components/TextDefault'
import { alignment, colors, scale } from '@/utils'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import {
  Dimensions,
  DimensionValue,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle
} from 'react-native'

const { width } = Dimensions.get('window')

type RootStackParamList = {
  SubCategory: { id: string; title: string };
};

type CategoryCardNavigationProp = StackNavigationProp<RootStackParamList, 'SubCategory'>;

interface CategoryCardProps extends Omit<TouchableOpacityProps, 'style'> {
  id: string;
  cardLabel: string;
  style?: StyleProp<ViewStyle>;
  title: string;
}

function CategoryCard(props: CategoryCardProps) {
  const { id, cardLabel, style, ...restProps } = props;
  const navigation = useNavigation<CategoryCardNavigationProp>()
  
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('SubCategory', {
          id: id,
          title: cardLabel
        })
      }
      style={[styles.container, style]}
      {...restProps}
    >
      <View style={styles.textViewContainer}>
        <TextDefault numberOfLines={1} H5>
          {cardLabel}
        </TextDefault>
      </View>
    </TouchableOpacity>
  )
}

export default React.memo(CategoryCard)

const styles = StyleSheet.create({
  container: {
    width: width * 0.4 as DimensionValue,
    height: scale(50),
    backgroundColor: colors.whiteColor,
    borderRadius: scale(5),
    ...alignment.MTxSmall,
    ...alignment.MRxSmall
  },
  textViewContainer: {
    width: '100%' as DimensionValue,
    height: '100%' as DimensionValue,
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    ...alignment.PRxSmall,
    ...alignment.PLxSmall
  }
})