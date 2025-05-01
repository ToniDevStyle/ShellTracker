import { StatusBar, StyleSheet, Text, View, TextInput, Button, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import FoodListItem from "@/components/FoodListItem";
import { gql, useLazyQuery } from "@apollo/client";
import { useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";
import BackButton from "@/components/BackButton";

const query = gql`
  query search($ingr: String!) {
    search(ingr: $ingr) {
      hints {
        food {
          foodId
          label
          nutrients {
            ENERC_KCAL
          }
          brand
        }
      }
    }
  }
`;

export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const [runSearch, { data, loading, error }] = useLazyQuery(query);
  const router = useRouter();

  const performSearch = () => {
    runSearch({ variables: { ingr: search } });
  };

  const items = data?.search?.hints || [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.neutral900} />

      {/* Back Button */}
      <TouchableOpacity style={{marginBottom: 15}} onPress={() => router.back()}>
        <BackButton iconSize={28} />
      </TouchableOpacity>

      

      {/* Search Input */}
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar alimento..."
        style={styles.input}
        placeholderTextColor={colors.neutral400}
      />

      {/* Search Button */}
      {search && <Button title="Buscar" onPress={performSearch} />}

      {/* Results Container */}
      <View style={styles.resultsContainer}>
        {loading && <ActivityIndicator />}
        {error && <Text style={{ color: 'red' }}>Failed to search</Text>}
        <FlatList
          data={items}
          renderItem={({ item }) => <FoodListItem item={item} />}
          ListEmptyComponent={() => <Typo style={{marginTop: 15}}>   🍏   🍉   🫐   🥐   🍳   🍕   🍫   🍯   🍣</Typo>}
          contentContainerStyle={{ gap: spacingY._10 }}
          nestedScrollEnabled={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    backgroundColor: colors.neutral900, // Asegura el color de fondo
    paddingTop:70, // Evita el padding extra arriba
  },
  backButton: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: "flex-start",
  },
  headerText: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 30,
    color: colors.neutral200,
    marginBottom: spacingY._10,
  },
  resultsContainer: {
    flex: 1,
    gap: spacingY._10,
  },
});
