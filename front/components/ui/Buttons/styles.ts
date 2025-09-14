import { 
  verticalScale, 
  scale, 
  colors, 
  fontStyles 
} from '@/utils';
import { StyleSheet } from 'react-native'; // Import StyleSheet

const mainBtnStyles = StyleSheet.create({
  backgroundColor: {
    backgroundColor: colors.brownColor,
    height: scale(50),
    borderRadius: scale(4)
  },
  main_brown_btn: {
    alignItems: 'center', // Now this will be properly typed
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  btn_text: {
    color: colors.secondaryWhiteColor,
    fontFamily: fontStyles.PoppinsRegular,
    fontSize: verticalScale(16)
  }
});

const alternateBtn = StyleSheet.create({
  backgroundColor: {
    backgroundColor: colors.secondaryWhiteColor,
    height: scale(50),
    borderRadius: scale(3),
    borderWidth: scale(2),
    borderColor: colors.horizontalLine
  },
  main_alt_btn: {
    alignItems: 'center', // Properly typed
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  btn_text: {
    color: colors.brownColor,
    fontFamily: fontStyles.PoppinsRegular,
    fontSize: verticalScale(16),
    fontWeight: '500' as '500' // Cast to specific literal type
  }
});

const blueBtn = StyleSheet.create({
  backgroundColor: {
    backgroundColor: colors.buttonBackground,
    height: verticalScale(46),
    borderRadius: verticalScale(3)
  },
  main_blue_btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  btn_text: {
    color: colors.secondaryWhiteColor,
    fontFamily: fontStyles.PoppinsRegular,
    fontSize: verticalScale(16)
  }
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.brownColor,
    height: scale(40),
    borderRadius: scale(4),
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: colors.textBlueColor,
    fontFamily: fontStyles.PoppinsRegular,
    fontSize: scale(16)
  }
});

const alternateBlueBtn = StyleSheet.create({
  backgroundColor: {
    height: verticalScale(46),
    borderRadius: verticalScale(3),
    borderWidth: verticalScale(2),
    borderColor: colors.textBlueColor
  },
  main_blue_btn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  btn_text: {
    color: colors.textBlueColor,
    fontFamily: fontStyles.PoppinsRegular,
    fontSize: verticalScale(16)
  }
});

export { alternateBtn, mainBtnStyles, blueBtn, alternateBlueBtn, styles };