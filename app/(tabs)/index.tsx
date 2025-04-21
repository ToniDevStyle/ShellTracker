import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button from '@/components/Button'
import Typo from '@/components/Typo'

const Home = () => {
  return (
    <View>
      <Text>Home</Text>
      <Button>
        <Typo>Text Log Out</Typo> 
        </Button>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})