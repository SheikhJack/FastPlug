import TextDefault from '@/components/TextDefault'
import UserContext from '@/context/User'
import { Product } from '@/lib/types/product'
import { alignment, colors, scale } from '@/utils'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useContext, useEffect, useState } from 'react'
import { Image, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle, ActivityIndicator } from 'react-native'
import { productApi } from '@/lib/productApi'

type RootStackParamList = {
  ProductDescription: { product: Product };
  SignIn: undefined;
};

type ProductCardNavigationProp = StackNavigationProp<RootStackParamList>;

interface ProductCardProps {
  productId?: string; 
  product?: Product; 
  featured?: string;
  styles?: StyleProp<ViewStyle>;
  
}

const placeholderImage = require('../../../assets/images/formBackground.png')

function ProductCard(props: ProductCardProps) {
  const navigation = useNavigation<ProductCardNavigationProp>()
  const userContext = useContext(UserContext)

  const {
    isLoggedIn = false,
    profile = null,
    addToWishlist = async () => { },
    removeFromWishlist = async () => { }
  } = userContext || {};

  const [product, setProduct] = useState<Product | null>(props.product || null)
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(!props.product && !!props.productId)

  useEffect(() => {
    if (props.product) {
      setProduct(props.product)
    } else if (props.productId) {
      fetchProduct()
    }
  }, [props.product, props.productId])

  useEffect(() => {
    if (isLoggedIn && profile?.whishlist && product) {
      setLiked(!!profile.whishlist.find((item: any) => item._id === product._id))
    } else {
      setLiked(false)
    }
  }, [profile, isLoggedIn, product])

  const fetchProduct = async () => {
    if (!props.productId) return
    
    setFetching(true)
    try {
      const result = await productApi.getProduct(props.productId)
      if (result.success && result.data) {
        setProduct(result.data.product)
      } else {
        console.error('Failed to fetch product:', result.error)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setFetching(false)
    }
  }

  const handleWishlistToggle = async () => {
    if (!isLoggedIn || !product) {
      navigation.navigate('SignIn')
      return
    }

    setLoading(true)
    try {
      if (liked) {
        await removeFromWishlist(product._id)
      } else {
        await addToWishlist(product._id)
      }
      setLiked(prev => !prev)
    } catch (error) {
      console.error('Wishlist operation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <View style={[styles.cardContainer, props.styles, styles.loadingContainer]}>
        <ActivityIndicator size="small" color={colors.primaryBlackColor} />
      </View>
    )
  }

  if (!product) {
    return (
      <View style={[styles.cardContainer, props.styles, styles.errorContainer]}>
        <TextDefault small textColor={colors.errorColor}>
          Product not available
        </TextDefault>
      </View>
    )
  }

  return (
    <TouchableOpacity
      disabled={loading}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('ProductDescription', { product })
      }
      style={[styles.cardContainer, props.styles]}>

      <View style={styles.topCardContainer}>
        <Image
          source={product.image ? { uri: product.image } : placeholderImage}
          resizeMode="cover"
          style={styles.imgResponsive}
        />
        {props.featured && (
          <View style={styles.featuredBadge}>
            <TextDefault small bold style={styles.featuredText}>
              Featured
            </TextDefault>
          </View>
        )}
      </View>

      <View style={styles.botCardContainer}>
        <View style={styles.botSubCardContainer}>
          <View>
            <TextDefault numberOfLines={1} textColor={colors.fontMainColor}>
              {product.title}
            </TextDefault>
            <View style={styles.priceContainer}>
              <TextDefault
                style={{ maxWidth: '70%' }}
                numberOfLines={1}
                textColor={colors.fontSecondColor}
                small>
                {product.categoryName || 'Uncategorized'}
              </TextDefault>
              <View style={styles.ratingContainer}>
                <View style={{ alignSelf: 'center', height: '80%' }}>
                  <Ionicons name="star" size={scale(11)} color="#4165b9" />
                </View>
                <TextDefault
                  textColor={colors.fontSecondColor}
                  style={{ marginLeft: 2 }}>
                  {product.rating?.average || 0}
                </TextDefault>
                <TextDefault
                  textColor={colors.fontSecondColor}
                  style={{ marginLeft: 2 }}
                  small>
                  {`( ${product.rating?.count || 0} )`}
                </TextDefault>
              </View>
            </View>
          </View>

          <View style={styles.priceContainer}>
            <TextDefault
              style={{ maxWidth: '75%' }}
              numberOfLines={1}
              textColor={colors.fontBlue}>
              ${product.price.toFixed(2)}
            </TextDefault>
            {product.originalPrice && product.originalPrice > product.price && (
              <TextDefault
                style={styles.originalPrice}
                small
                textColor={colors.fontSecondColor}>
                ${product.originalPrice.toFixed(2)}
              </TextDefault>
            )}
            <View style={styles.aboutRestaurant}>
              <TouchableOpacity
                disabled={loading}
                activeOpacity={0.7}
                onPress={handleWishlistToggle}
                style={styles.likeContainer}>
                <Ionicons
                  name={liked ? 'heart-sharp' : 'heart-outline'}
                  size={scale(18)}
                  color={liked ? colors.errorColor : colors.fontSecondColor}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default React.memo(ProductCard)

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.medHorizontalLine,
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroudGray,
  },
  topCardContainer: {
    width: '100%',
    height: '70%',
    position: 'relative',
  },
  imgResponsive: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  featuredBadge: {
    position: 'absolute',
    top: scale(8),
    left: scale(8),
    backgroundColor: colors.primaryBlackColor,
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(4),
  },
  featuredText: {
    color: colors.white,
  },
  botCardContainer: {
    width: '100%',
    height: '30%',
    alignItems: 'center',
    backgroundColor: colors.container,
    ...alignment.PTxSmall,
  },
  botSubCardContainer: {
    width: '90%',
    height: '100%',
    justifyContent: 'space-between',
    ...alignment.PBxSmall,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aboutRestaurant: {
    justifyContent: 'center',
  },
  likeContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginRight: scale(4),
  },
})