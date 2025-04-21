import { Pressable, StyleSheet, Text, View, Alert } from 'react-native'
import ScreenWrapper from '@/components/ScreenWrapper'
import React, { useRef } from 'react'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import * as Icons from 'phosphor-react-native'
import Button from '@/components/Button'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '@/contexts/authContext'

const Login = () => {

    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {login: loginUser} = useAuth();

    const handleSubmit = async() => {
        if(!emailRef.current || !passwordRef.current) {
            Alert.alert("Por favor, completa todos los campos");
            return;
        }

        setIsLoading(true);
        const res = await loginUser(emailRef.current, passwordRef.current);
        setIsLoading(false);
        if(!res.success) {
            Alert.alert("Login: ", res.msg);
            return;
        }
    }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28}/>
        <View style= {{gap: 5, marginTop: spacingY._20}}> 
            <Typo size={30} fontWeight={"800"}>¡Hola </Typo>
            <Typo size={30} fontWeight={"800"}>de nuevo!😄</Typo>
        </View>
        {/* login form */}
        <View style={styles.form}>
            <Typo size={16} color={colors.textLighter}> Inicia sesión para continuar</Typo>
            {/* input fields */}
            <Input 
                placeholder='Correo electrónico' onChangeText={(value) => emailRef.current = value} icon={<Icons.At size={verticalScale(26)} color={colors.neutral300} />}
            />
            <Input 
                placeholder='Contraseña' secureTextEntry onChangeText={(value) => passwordRef.current = value} icon={<Icons.Lock size={verticalScale(26)} color={colors.neutral300} />}
            />
            <Typo size={14} color={colors.text} style={{alignSelf: 'flex-end'}}>¿Has olvidado la contraseña?</Typo>
            <Button loading={isLoading} onPress={handleSubmit}>
                <Typo size={21} color={colors.black} fontWeight={"700"}>Iniciar sesión</Typo>
            </Button>
        </View>
        {/* footer */}
         <View style={styles.footer}>
            <Typo size={15} >¿No tienes cuenta?</Typo>
            <Pressable onPress={() => router.navigate('/(auth)/register')}>
                <Typo size={15} fontWeight={"700"} color={colors.primary}> Regístrate</Typo>
            </Pressable>
            
         </View>
      </View>
    </ScreenWrapper>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: spacingY._20,
        paddingHorizontal: spacingX._20,
    },
    welcomeText: {
        fontSize: verticalScale(20),
        fontWeight: "bold",
        color: colors.text,
    },
    form: {
        gap: spacingY._20,
    },
    forgotPassword: {
        textAlign: "right",
        fontWeight: "500",
        color: colors.text,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "5",
    },
    footerText: {
        textAlign: "center",
        color: colors.text,
        fontSize: verticalScale(15),
    },
})




