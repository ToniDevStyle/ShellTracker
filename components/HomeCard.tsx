import { ImageBackground, StyleSheet, View } from 'react-native'
import React from 'react'
import Typo from './Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import * as Icons from 'phosphor-react-native'
import { useAuth } from '@/contexts/authContext'
import calculateCalories from '@/utils/calculateCalories';

const HomeCard = () => {
  const { user } = useAuth();

  // Si falta algún dato, ponemos calorías a 0
  const totalCalories = (user?.gender && user?.age != null && user?.height != null && user?.weight != null && user?.activity)
    ? calculateCalories({
        gender: user.gender,
        age: user.age,
        height: user.height,
        weight: user.weight,
        activity: user.activity
      })
    : 0;

  return (
    <ImageBackground
      source={require('../assets/images/card.png')}
      resizeMode='stretch'
      style={styles.bgImage}
    >
      <View style={styles.container}>
        <View>
          {/* Total Calories Balance */}
          <View style={styles.totalBalanceCaloriesRow}>
            <Typo color={colors.neutral800} size={17} fontWeight={"500"}>Calorías Totales</Typo>
            <Icons.DotsThreeOutline size={verticalScale(23)} weight='fill' />
          </View>
          <Typo color={colors.black} size={30} fontWeight={'bold'}>
            {totalCalories}
          </Typo>
        </View>
      </View>
    </ImageBackground>
  )
}

export default HomeCard

const styles = StyleSheet.create({
  bgImage: {
    height: scale(210),
    width: "100%"
  },
  container: {
    padding: spacingX._20,
    paddingHorizontal: scale(23),
    height: "87%",
    width: "100%",
    justifyContent: "space-between"
  },
  totalBalanceCaloriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY._5,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsIcon: {
    backgroundColor: colors.neutral350,
    padding: spacingY._5,
    borderRadius: 50,
  },
  incomeCalories: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingY._7,
  }
})
