import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Header from '@/components/Header'
import Typo from '@/components/Typo'
import { useAuth } from '@/contexts/authContext'
import { Image } from 'expo-image'
import { getProfileImage } from '@/services/imageService'
import { accountOptionType } from '@/types'
import * as Icons from 'phosphor-react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { signOut } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useRouter } from 'expo-router'

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();

  const accountOptions: accountOptionType[] = [
    {
      title: "Editar Perfil",
      icon: (
        <Icons.User
          size={26}
          color={colors.white}
          weight='fill'
        />
      ),
      routeName: '/(modals)/profileModal',
      bgColor: "#6366f1"
    },
    {
      title: "Cerrar Sesión",
      icon: (
        <Icons.Power
          size={26}
          color={colors.white}
          weight='fill'
        />
      ),
      bgColor: "#e11d48"
    },
  ];

  const handleLogOut = async () => {
    await signOut(auth);
  }

  const showLogOutAlert = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que quieres cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar Sesión", onPress: () => handleLogOut(), style: "destructive" }
    ])
  }

  const handlePress = (item: accountOptionType) => {
    if (item.title == "Cerrar Sesión") {
      showLogOutAlert();
    }
    if (item.routeName) router.push(item.routeName);
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title='Perfil' style={{ marginVertical: spacingY._10 }} />

        <View style={styles.userInfo}>
          <Image
            source={getProfileImage(user?.image)}
            style={styles.avatar}
            contentFit="cover"
            transition={100}
          />
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={"600"} color={colors.neutral100}>
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>

        <View style={styles.accountOptions}>
          {accountOptions.map((item, index) => (
            <Animated.View
              key={index.toString()}
              entering={FadeInDown.delay(index * 50).springify().damping(14)}
              style={styles.listItem}
            >
              <TouchableOpacity style={styles.flexRow} onPress={() => handlePress(item)}>
                <View style={[styles.listIcon, { backgroundColor: item.bgColor }]}>
                  {item.icon}
                </View>
                <Typo size={16} style={{ flex: 1 }} fontWeight={'500'}>
                  {item.title}
                </Typo>
                <Icons.CaretRight
                  size={verticalScale(20)}
                  weight='bold'
                  color={colors.white}
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: 'center',
    gap: spacingY._15,
  },
  avatar: {
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: 'center',
  },
  accountOptions: {
    marginTop: spacingY._40,
    gap: verticalScale(15), // Más separación entre opciones
  },
  listItem: {},
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._15,
    backgroundColor: colors.neutral800,
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius._12,
  },
});
