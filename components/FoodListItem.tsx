import AntDesign from "@expo/vector-icons/AntDesign";
import { gql, useMutation, useApolloClient } from "@apollo/client";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import { useAuth } from "@/contexts/authContext";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const mutation = gql`
  mutation InsertFood_log($food_id: String!, $kcal: Int!, $label: String!, $user_id: String!) {
    insertFood_log(food_id: $food_id, kcal: $kcal, label: $label, user_id: $user_id) {
      created_at
      food_id
      id
      kcal
      label
      user_id
      __typename
    }
  }
`;

type FoodItem = {
  food: {
    foodId: string;
    label: string;
    nutrients: {
      ENERC_KCAL: number;
    };
    brand?: string;
  };
};

const FoodListItem = ({ item }: { item: FoodItem }) => {
  const { user } = useAuth();
  const router = useRouter();
  const client = useApolloClient();

  const [logFood] = useMutation(mutation, {
    update(cache, { data: { insertFood_log } }) {
      try {
        const currentDateUTC = dayjs.utc().format("YYYY-MM-DD");

        const cacheResult = cache.readQuery<{ foodLogsForDate?: any[] }>({
          query: gql`
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
          `,
          variables: { date: currentDateUTC, user_id: user?.uid },
        });

        const existingFoodLogs = cacheResult?.foodLogsForDate || [];

        cache.writeQuery({
          query: gql`
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
          `,
          variables: { date: currentDateUTC, user_id: user?.uid },
          data: {
            foodLogsForDate: [insertFood_log, ...existingFoodLogs],
          },
        });
      } catch (error) {
        console.log("Error updating cache:", error);
      }
    },
    onCompleted: () => {
      router.back();
    },
  });

  const onPlusPress = async () => {
    try {
      await logFood({
        variables: {
          food_id: item.food.foodId,
          kcal: item.food.nutrients.ENERC_KCAL,
          label: item.food.label,
          user_id: user?.uid,
        },
      });
    } catch (error) {
      console.error("Error al registrar comida:", error);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "gainsboro",
        padding: 10,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ backgroundColor: "gainsboro", flex: 1, gap: 5 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16, color: "black" }}>
          {item.food.label}
        </Text>
        <Text style={{ color: "dimgray" }}>
          {item.food.nutrients.ENERC_KCAL} kcal
          {item.food.brand ? ` - ${item.food.brand}` : ""}
        </Text>
      </View>
      <AntDesign onPress={onPlusPress} name="pluscircleo" size={24} color="royalblue" />
    </View>
  );
};

export default FoodListItem;
