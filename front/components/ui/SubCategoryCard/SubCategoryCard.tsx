import React from 'react'
import { 
  TouchableOpacity, 
  View, 
  ImageBackground, 
  StyleProp, 
  ViewStyle,
  ImageSourcePropType,
  TouchableOpacityProps 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextDefault } from '@/components/TextDefault';
import { colors, alignment } from '@/utils';
import { StyleSheet } from 'react-native';

type RootStackParamList = {
  ProductListing: { id: string };
};

type SubCategoryCardNavigationProp = StackNavigationProp<RootStackParamList, 'ProductListing'>;

interface SubCategory {
  _id: string;
  title: string;
  image?: string;
}

interface SubCategoryCardProps extends Omit<TouchableOpacityProps, 'style' | 'onPress'> {
  data: SubCategory;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<ViewStyle>;
  onPress?: (subCategory: SubCategory) => void; // Custom press handler
}

function SubCategoryCard(props: SubCategoryCardProps) {
  const { 
    data, 
    style, 
    imageStyle, 
    textStyle, 
    onPress,
    ...restProps 
  } = props;
  
  const navigation = useNavigation<SubCategoryCardNavigationProp>()

  const imageSource: ImageSourcePropType = data.image 
    ? { uri: data.image } 
    : require('../../assets/images/formBackground.png');

  const handlePress = () => {
    if (onPress) {
      onPress(data);
    } else {
      navigation.navigate('ProductListing', { id: data._id });
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[styles.container, style]}
      {...restProps}>
      <View style={styles.cardImageContainer}>
        <ImageBackground
          source={imageSource}
          defaultSource={require('../../assets/images/formBackground.png')}
          resizeMode="cover"
          style={[styles.imgResponsive, imageStyle]}>
          <View style={[styles.cardText, textStyle]}>
            <TextDefault
              numberOfLines={1}
              textColor={colors.white}
              H5
              style={alignment.PxSmall}
              center>
              {data?.title ?? '....'}
            </TextDefault>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  )
}

export default React.memo(SubCategoryCard)

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.container,
    justifyContent: 'center',
    alignItems: 'center',
    ...alignment.PxSmall
  },
  cardImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  imgResponsive: {
    flex: 1,
    justifyContent: 'center',
    width: undefined,
    height: undefined
  },
  cardText: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)'
  }
})