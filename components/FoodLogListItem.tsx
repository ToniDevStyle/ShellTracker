import { View, Text, StyleSheet } from "react-native";

// Definimos una interfaz para el objeto item
interface FoodLogItem {
  label: string;
  kcal: number;
}

interface Props {
  item: FoodLogItem;
}

const FoodLogListItem: React.FC<Props> = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, gap: 5 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.label}</Text>
        <Text style={{ color: "dimgray" }}>{item.kcal} cal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f6f6f8",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default FoodLogListItem;
