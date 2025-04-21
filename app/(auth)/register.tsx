import {
    Pressable,
    StyleSheet,
    Text,
    View,
    Alert,
    ScrollView,
    Modal,
    TouchableOpacity,
  } from 'react-native';
  import ScreenWrapper from '@/components/ScreenWrapper';
  import React, { useRef, useState } from 'react';
  import Typo from '@/components/Typo';
  import { colors, spacingX, spacingY } from '@/constants/theme';
  import { verticalScale } from '@/utils/styling';
  import BackButton from '@/components/BackButton';
  import Input from '@/components/Input';
  import * as Icons from 'phosphor-react-native';
  import Button from '@/components/Button';
  import { useRouter } from 'expo-router';
  import { Picker } from '@react-native-picker/picker';
  
  const Register = () => {
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const nameeRef = useRef('');
    const ageRef = useRef('');
    const heightRef = useRef('');
    const weightRef = useRef('');
    const [gender, setGender] = useState('');
    const [activity, setActivity] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showGenderPicker, setShowGenderPicker] = useState(false);
    const [showActivityPicker, setShowActivityPicker] = useState(false);
    const router = useRouter();
  
    const isNumeric = (value: string) => /^(\d+|\d+\.\d+)$/.test(value);
  
    const handleSubmit = () => {
      if (
        !emailRef.current ||
        !passwordRef.current ||
        !nameeRef.current ||
        !ageRef.current ||
        !gender ||
        !heightRef.current ||
        !weightRef.current ||
        !activity
      ) {
        Alert.alert('Por favor, completa todos los campos para poder ayudarte');
        return;
      }
  
      if (
        !isNumeric(heightRef.current) ||
        !isNumeric(weightRef.current) ||
        !isNumeric(ageRef.current)
      ) {
        Alert.alert('La altura, el peso y la edad deben ser valores numéricos');
        return;
      }
  
      console.log('Email:', emailRef.current);
      console.log('Password:', passwordRef.current);
      console.log('Name:', nameeRef.current);
      console.log('Age:', ageRef.current);
      console.log('Gender:', gender);
      console.log('Height:', heightRef.current);
      console.log('Weight:', weightRef.current);
      console.log('Activity Level:', activity);
      console.log('good to go');
    };
  
    return (
      <ScreenWrapper>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <BackButton iconSize={28} />
          <View style={{ gap: 5, marginTop: spacingY._20 }}>
            <Typo size={30} fontWeight={'800'}>
              ¡Hola!😄
            </Typo>
          </View>
  
          <View style={styles.form}>
            <Typo size={16} color={colors.textLighter}>
              Crea una cuenta para continuar
            </Typo>
  
            <Input
              placeholder="Nombre"
              onChangeText={(value) => (nameeRef.current = value)}
              icon={
                <Icons.User size={verticalScale(26)} color={colors.neutral300} />
              }
            />
            <Input
              placeholder="Correo electrónico"
              onChangeText={(value) => (emailRef.current = value)}
              icon={<Icons.At size={verticalScale(26)} color={colors.neutral300} />}
            />
            <Input
              placeholder="Contraseña"
              secureTextEntry
              onChangeText={(value) => (passwordRef.current = value)}
              icon={<Icons.Lock size={verticalScale(26)} color={colors.neutral300} />}
            />
            <Input
              placeholder="Edad"
              keyboardType="numeric"
              onChangeText={(value) => (ageRef.current = value)}
              icon={<Icons.Calendar size={verticalScale(26)} color={colors.neutral300} />}
            />
  
            {/* Picker personalizado para Género */}
            <TouchableOpacity
              style={styles.customPicker}
              onPress={() => setShowGenderPicker(true)}
            >
              <Text style={{ color: gender ? colors.text : colors.neutral300 }}>
                {gender || 'Selecciona género'}
              </Text>
            </TouchableOpacity>
            <Modal visible={showGenderPicker} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Picker
                    selectedValue={gender}
                    onValueChange={(value) => {
                      setGender(value);
                      setShowGenderPicker(false);
                    }}
                  >
                    <Picker.Item label="Masculino" value="Masculino" />
                    <Picker.Item label="Femenino" value="Femenino" />
                  </Picker>
                  <Button onPress={() => setShowGenderPicker(false)}>
                    <Typo>Cerrar</Typo>
                  </Button>
                </View>
              </View>
            </Modal>
  
            <Input
              placeholder="Altura (cm)"
              keyboardType="decimal-pad"
              onChangeText={(value) => (heightRef.current = value)}
              icon={<Icons.ArrowUp size={verticalScale(26)} color={colors.neutral300} />}
            />
            <Input
              placeholder="Peso (kg)"
              keyboardType="decimal-pad"
              onChangeText={(value) => (weightRef.current = value)}
              icon={<Icons.ArrowDown size={verticalScale(26)} color={colors.neutral300} />}
            />
  
            {/* Picker personalizado para Actividad */}
            <TouchableOpacity
              style={styles.customPicker}
              onPress={() => setShowActivityPicker(true)}
            >
              <Text style={{ color: activity ? colors.text : colors.neutral300 }}>
                {activity || 'Nivel de actividad'}
              </Text>
            </TouchableOpacity>
            <Modal visible={showActivityPicker} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Picker
                    selectedValue={activity}
                    onValueChange={(value) => {
                      setActivity(value);
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
  
            <Button loading={isLoading} onPress={handleSubmit}>
              <Typo size={21} color={colors.black} fontWeight={'700'}>
                Registrarse
              </Typo>
            </Button>
          </View>
  
          {/* footer */}
          <View style={styles.footer}>
            <Typo size={15}>¿Ya tienes cuenta?</Typo>
            <Pressable onPress={() => router.navigate('/(auth)/login')}>
              <Typo size={15} fontWeight={'700'} color={colors.primary}>
                {' '}
                Inicia sesión
              </Typo>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenWrapper>
    );
  };
  
  export default Register;
  
  const styles = StyleSheet.create({
    scroll: {
      flex: 1,
    },
    container: {
      gap: spacingY._20,
      paddingHorizontal: spacingX._20,
      paddingBottom: spacingY._40,
    },
    form: {
      gap: spacingY._20,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: spacingY._20,
    },
    customPicker: {
      borderWidth: 1,
      borderColor: colors.neutral200,
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
    },
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
  });
  