import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { Rating } from 'react-native-ratings'
import { verticalScale } from '@/utils/scaling'
import { colors } from '@/utils/colors'
import { fontStyles } from '@/utils/fontStyles'

/* Config/Constants
============================================================================= */

/* =============================================================================
<FullCard />
--------------------------------------------------------------------------------
Props:
  ?
// ImageURL is currently a placeholder add URI functionality on DYS basis
productName - Name of the product
productRating - 1-5 stars rating
productTotalVotes - total amount of users that voted
productPrevPrice - Previous price of unit, if null wont be showed
productNewPrice - Current Price of the unit
productBagde - Is it new product?
productImageURI - URI of the image - DYS basis
============================================================================= */
function FullCard(props: any) {
  let renderPreviousAmount = null
  let badge = null
  function renderPrevousPrice(amount: any) {
    return (
      <Text
        style={[
          styles.prevPriceText,
          Platform.OS === 'android' && {
            includeFontPadding: false,
            textAlignVertical: 'bottom' as 'bottom', // Cast to literal type
          }
        ]}>
        {amount} PKR
      </Text>
    )
  }

  // if product is new
  function renderBadge() {
    return <Text style={styles.badge}>New</Text>
  }
  function renderPreviousPage() {
    if (props.productPreviousPrice) {
      renderPreviousAmount = renderPrevousPrice(props.productPreviousPrice)
    }

    if (props.productBadge) {
      badge = renderBadge()
    }
  }
  // render the whole content
  return (
    <>
      {renderPreviousPage()}
      <View style={styles.container}>
        <View style={styles.leftside}>
          <Image
            style={styles.thumbnail}
            resizeMode="cover"
            source={props.productImage}
          />
          {badge}
        </View>
        <View style={styles.rightside_container}>
          <View style={styles.rightside}>
            <View style={styles.rightside_top}>
              <Text style={styles.product} numberOfLines={2}>
                {props.productName}
              </Text>
              <View style={styles.ratingContainer}>
                <Rating
                   readonly={true}
                  ratingCount={5}
                  startingValue={props.productRating}
                  imageSize={verticalScale(14)}
                />
                <Text style={styles.votesCount}>{props.productTotalVotes}</Text>
              </View>
            </View>
            <View style={styles.rightside_bot}>
              {renderPreviousAmount}
              <View style={styles.special_row}>
                <Text style={styles.amount}>{props.productNewPrice} PKR</Text>
                <TouchableOpacity
                  activeOpacity={0}
                  onPress={() => {
                    console.log('Go to Cart')
                  }}>
                  <Image
                    style={{
                      width: verticalScale(16),
                      height: verticalScale(16)
                    }}
                    source={require('../../../assets/icons/shopcart.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  )
}

export default FullCard

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: verticalScale(90),
    marginBottom: verticalScale(15),
    borderRadius: verticalScale(3),
    borderWidth: verticalScale(1),
    borderColor: colors.backgroudGray,
    flexDirection: 'row'
  },
  leftside: {
    height: '100%',
    width: '35%'
  },
  thumbnail: {
    height: '100%',
    width: '100%',
    borderTopLeftRadius: verticalScale(3),
    borderBottomLeftRadius: verticalScale(3)
  },
  rightside_container: {
    backgroundColor: colors.secondaryWhiteColor,
    height: '100%',
    width: '65%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: verticalScale(3),
    borderBottomRightRadius: verticalScale(3)
  },
  ratingContainer: {
    flexDirection: 'row'
  },
  votesCount: {
    fontFamily: fontStyles.PoppinsRegular,
    fontSize: verticalScale(8),
    paddingTop: verticalScale(3),
    paddingLeft: verticalScale(3)
  },
  badge: {
    backgroundColor: 'purple',
    color: 'white',
    width: '30%',
    position: 'absolute',
    textAlign: 'center',
    lineHeight: verticalScale(18),
    fontFamily: fontStyles.PoppinsRegular,
    fontSize: verticalScale(11),
    borderRadius: verticalScale(3),
    zIndex: 1,
    elevation: 1,
    top: 10,
    left: 10
  },
  rightside: {
    height: '80%',
    width: '85%',
    justifyContent: 'space-between'
  },

  row: {
    flexDirection: 'row'
  },
  rightside_top: {
    alignItems: 'flex-start'
  },
  rightside_bot: {
    alignItems: 'flex-end'
  },
  special_row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  qty: {
    fontFamily: fontStyles.PoppinsRegular,
    color: colors.primaryBlackColor,
    fontSize: verticalScale(13),
    fontWeight: '500'
  },
  amount: {
    fontFamily: fontStyles.PoppinsRegular,
    color: colors.textBlueColor,
    fontSize: verticalScale(13),
    fontWeight: '500',
    lineHeight: verticalScale(13),
    paddingTop: verticalScale(5)
  },
  product: {
    width: '95%',
    fontFamily: fontStyles.PoppinsRegular,
    color: colors.primaryBlackColor,
    fontSize: verticalScale(13),
    lineHeight: verticalScale(14.5)
  },
  by: {
    fontFamily: fontStyles.PoppinsRegular,
    color: colors.primaryBlackColor,
    fontSize: verticalScale(11)
  },
  brand: {
    fontFamily: fontStyles.PoppinsRegular,
    color: colors.brownColor,
    fontSize: verticalScale(11)
  },
  prevPrice: {
    alignSelf: 'flex-start'
  },
  prevPriceText: {
    color: colors.googleRedColor,
    fontFamily: fontStyles.PoppinsRegular,
    fontSize: verticalScale(9),
    lineHeight: verticalScale(10),
    alignSelf: 'flex-start',
    paddingBottom: 0,
    marginBottom: 0
  }
})
