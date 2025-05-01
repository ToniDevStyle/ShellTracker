import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { AuthProvider } from '@/contexts/authContext'
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const StackLayout = () => {
  return <Stack screenOptions={ {headerShown: false}}>
      <Stack.Screen name="(modals)/profileModal" options={{ presentation: 'modal' }} />
  </Stack>
}

const client = new ApolloClient({
  uri: process.env.EXPO_PUBLIC_GRAPHQL_URI!,
  cache: new InMemoryCache(),
  headers: {
    Authorization: process.env.EXPO_PUBLIC_GRAPHQL_APIKEY!,
  },
});


  export default function RootLayout() {
    return (
        <AuthProvider>
        <ApolloProvider client={client}>
        <StackLayout />
        </ApolloProvider>
        </AuthProvider>
    )
  }



const styles = StyleSheet.create({});