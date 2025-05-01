
import AntDesign from "@expo/vector-icons/AntDesign";
import {gql, useMutation} from "@apollo/client";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/authContext";


const mutation = gql`
mutation MyMutation ($food_id: String!, $kcal: Int!, $label: String!, $user_id:String!) {
  insertFood_log(food_id: $food_id, kcal: $kcal, label: $label, user_id: $user_id) {
    created_at
    food_id
    id
    kcal
    label
  }
} `


// CUSTOM COMPONENT 
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
  const { user } = useAuth(); // Obtener el usuario actual
  const router = useRouter();

  const [logFood, { data, loading, error }] = useMutation(mutation, {
    refetchQueries: ['foodLogsForDate'],
    awaitRefetchQueries: true,
  });

  const onPlusPress = async () => {
    try {
      const response = await logFood({
        variables: {
          food_id: item.food.foodId,
          kcal: item.food.nutrients.ENERC_KCAL,
          label: item.food.label,
          user_id: user?.uid, 
        },
      });
      console.log("Respuesta:", response);
      console.log("Insertado:", response?.data?.insertFood_log);

      router.back();
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
          {item.food.brand ? ` - ${item.food.brand}` : ''}
        </Text>
      </View>
      <AntDesign
        onPress={onPlusPress}
        name="pluscircleo"
        size={24}
        color="royalblue"
      />
    </View>
  );
};

export default FoodListItem;