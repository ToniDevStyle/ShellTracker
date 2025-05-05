import { ImageBackground, StyleSheet, View } from 'react-native';
import React from 'react';
import Typo from './Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { scale, verticalScale } from '@/utils/styling';
import * as Icons from 'phosphor-react-native';
import { useAuth } from '@/contexts/authContext';
import calculateCalories from '@/utils/calculateCalories';

interface HomeCardProps { // Define una interfaz para las props
  foodLogs: { kcal: number }[];
}

const HomeCard: React.FC<HomeCardProps> = ({ foodLogs }) => { // Usa la interfaz en la definición del componente
  const { user } = useAuth();

  // Calcular las calorías recomendadas
  const totalRecommendedCalories = (user?.gender && user?.age != null && user?.height != null && user?.weight != null && user?.activity)
    ? calculateCalories({
        gender: user.gender,
        age: user.age,
        height: user.height,
        weight: user.weight,
        activity: user.activity
      })
    : 0;

  // Calcular la suma de las calorías registradas
  const totalLoggedCalories = foodLogs.reduce((sum, log) => sum + log.kcal, 0);

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
            <Typo color={colors.neutral800} size={17} fontWeight={"500"}>Calorías Recomendadas</Typo>
            <Icons.DotsThreeOutline size={verticalScale(23)} weight='fill' />
          </View>
          <Typo color={colors.black} size={30} fontWeight={'bold'}>
            {totalRecommendedCalories - totalLoggedCalories}
          </Typo>
        </View>

        {/* Suma de kcal de alimentos seleccionados */}
        <View style={styles.stats}>
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeCalories}>
              <View style={styles.statsIcon}>
                <Icons.ArrowUp
                  size={verticalScale(15)}
                  color={colors.black}
                  weight='bold'
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={'500'}>
                Registradas
              </Typo>
            </View>
            <View style={{ alignSelf: 'center' }}>
              <Typo color='#FF8C00' fontWeight={'600'}>{totalLoggedCalories}</Typo>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;

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
});