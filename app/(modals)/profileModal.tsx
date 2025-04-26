import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import ScreenWrapper from '@/components/ScreenWrapper'
import ModalWrapper from '@/components/ModalWrapper'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import { Image } from 'expo-image'
import { getProfileImage } from '@/services/imageService'
import * as Icons from 'phosphor-react-native'
import Typo from '@/components/Typo'
import Input from '@/components/Input'
import { UserDataType } from '@/types'
import Button from '@/components/Button'
import { Picker } from '@react-native-picker/picker'
import { useAuth } from '@/contexts/authContext'
import { updateUSer } from '@/services/userService'
import { useRouter } from 'expo-router'

const ProfileModal = () => {

    const {user, updateUserData} = useAuth();

    const [userData, setUserData] = useState<UserDataType>({
        name: '',
        image: null,
        height: '',
        weight: '',
        activity: '',

    })

    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const [showActivityPicker, setShowActivityPicker] = useState(false);

    useEffect(() => {
        setUserData({
            name: user?.name || '',
            image: user?.image || null,
            height: user?.height?.toString() || '',
            weight: user?.weight?.toString() || '',
            activity: user?.activity || '',
        })
    }, [user])


    const onSubmit = async() => {
        let {name, image, height, weight, activity} = userData;
        if(!name.trim() ||  !height?.trim() || !weight?.trim() || !activity?.trim()) {
            Alert.alert('Error', 'Por favor rellena todos los campos');
            return;
        }

        setLoading(true);
        const res = await updateUSer(user?.uid as string, userData)
        setLoading(false);
        if(res.success) {
            updateUserData(user?.uid as string);
            Alert.alert('Éxito', res.msg || 'Usuario actualizado correctamente');
            router.back();
        }else{
            Alert.alert('Error', res.msg || 'Error al actualizar el usuario');
        }
    }

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header title="Editar Perfil" leftIcon={<BackButton />} style={{marginBottom: spacingY._10}}/>
        {/* form */}
        <ScrollView contentContainerStyle={styles.form}>
            <View style={styles.avatarContainer}>
                <Image
                    style={styles.avatar}
                    source={getProfileImage(userData.image)}
                    contentFit='cover'
                    transition={100}
                />

                <TouchableOpacity style={styles.editIcon}>
                    <Icons.Pencil 
                        size={verticalScale(20)}
                        color={colors.neutral800}
                        />
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <Typo color={colors.neutral200}>Nombre</Typo>
                <Input
                    placeholder='Nombre'
                    value={userData.name}
                    onChangeText={(text) => setUserData({...userData, name: text})}
                    />
            </View>
            <View style={styles.inputContainer}>
                <Typo color={colors.neutral200}>Altura</Typo>
                <Input
                    placeholder='Altura'
                    value={userData.height}
                    onChangeText={(text) => setUserData({...userData, height: text})}
                    />
            </View>
            <View style={styles.inputContainer}>
                <Typo color={colors.neutral200}>Peso</Typo>
                <Input
                    placeholder='Peso'
                    value={userData.weight}
                    onChangeText={(text) => setUserData({...userData, weight: text})}
                    />
            </View>
            <View style={styles.inputContainer}>
  <Typo color={colors.neutral200}>Nivel de Actividad</Typo>
  <TouchableOpacity
    style={styles.customPicker}
    onPress={() => setShowActivityPicker(true)}
  >
    <Text style={{ color: userData.activity ? colors.text : colors.neutral300 }}>
      {userData.activity || 'Selecciona nivel de actividad'}
    </Text>
  </TouchableOpacity>

  <Modal visible={showActivityPicker} transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Picker
          selectedValue={userData.activity}
          onValueChange={(value) => {
            setUserData({ ...userData, activity: value });
            setShowActivityPicker(false);
          }}
        >
          <Picker.Item label="Sedentaria" value="sedentaria" />
          <Picker.Item label="Moderada" value="moderada" />
          <Picker.Item label="Muy activa" value="muy_activa" />
        </Picker>
        <Button onPress={() => setShowActivityPicker(false)}>
          <Typo>Cerrar</Typo>
        </Button>
      </View>
    </View>
  </Modal>
</View>

        </ScrollView>
      </View>

        <View style={styles.footer}>
            <Button onPress={onSubmit} loading={loading} style={{flex: 1}}>
                <Typo color={colors.black} fontWeight={'700'}>Guardar</Typo>
            </Button>
        </View>

    </ModalWrapper>
  )
}

export default ProfileModal

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
    customPicker: {
        borderWidth: 1,
        borderColor: colors.neutral200,
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
      },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacingX._20,
        // paddingVertical: spacingY._30,
    },
    footer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral700,
        marginBottom: spacingY._5,
        borderTopWidth: 1,
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15
    },
    avatarContainer: {
        position: 'relative',
        alignSelf: 'center',
    },
    avatar: {
        alignSelf: 'center',
        backgroundColor: colors.neutral300,
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral500,
        //overflow: "hidden",
        //position: "relative",
    },
    editIcon: {
        position: 'absolute',
        bottom: spacingY._5,
        right: spacingX._7,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0},
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: spacingY._7,
    },
    inputContainer: {
        gap: spacingY._10,
    }
})