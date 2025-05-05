import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useAuth } from "@/contexts/authContext";
import ScreenWrapper from "@/components/ScreenWrapper";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import HomeCard from "@/components/HomeCard";
import { useRouter } from "expo-router";
import { gql, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import FoodLogListItem from "@/components/FoodLogListItem";

const query = gql`
  query foodLogsForDate($date: Date!, $user_id: String!) {
    foodLogsForDate(date: $date, user_id: $user_id) {
      food_id
      user_id
      created_at
      label
      kcal
      id
      __typename
    }
  }
`;

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const user_id = user?.uid;

  const { data, loading, error, refetch } = useQuery(query, {
    variables: { date: dayjs().format("YYYY-MM-DD"), user_id },
  });

  useEffect(() => {
    refetch(); // Fuerza una nueva búsqueda al montar el componente y cada vez que refetch cambia
  }, [refetch]);

  console.log("Estado de carga en Home:", loading);
  console.log("Error en Home:", error);
  console.log("Data completa en Home:", data);
  console.log("user_id en Home:", user_id);
  console.log("Fecha en Home:", dayjs().format("YYYY-MM-DD"));

  const foodLogs = data?.foodLogsForDate || [];

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral400}>
              Hello,{" "}
            </Typo>
            <Typo size={20} fontWeight={"500"}>
              {user?.name}
            </Typo>
          </View>
          <TouchableOpacity
            style={styles.searchIcon}
            onPress={() => router.navigate("../search")}
          >
            <Icons.MagnifyingGlass
              size={verticalScale(24)}
              color={colors.neutral200}
              weight="bold"
            />
          </TouchableOpacity>
        </View>
        {/* Card to show user Kcalories */}
        <HomeCard foodLogs={foodLogs} /> 

        <View>
          <FlatList
            data={foodLogs}
            contentContainerStyle={{ gap: 5 }}
            renderItem={({ item }) => {
              return <FoodLogListItem item={item} />;
            }}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  flatListContent: {
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(20),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30),
  },
  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
});