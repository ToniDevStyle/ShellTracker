import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return <Stack screenOptions={ {headerShown: false}}></Stack>
}

export default _layout

const syles = StyleSheet.create({});