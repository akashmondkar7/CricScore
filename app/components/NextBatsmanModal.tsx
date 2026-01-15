import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { THEME } from "../theme/colors";

export default function NextBatsmanModal({
  players,
  onSelect,
}: {
  players: { id: string; name: string }[];
  onSelect: (id: string) => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Next Batsman</Text>

      {players.map((p) => (
        <TouchableOpacity
          key={p.id}
          style={styles.option}
          onPress={() => onSelect(p.id)}
        >
          <Text style={styles.text}>{p.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  option: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: THEME.card,
    marginBottom: 10,
  },
  text: {
    color: THEME.text,
    fontWeight: "bold",
  },
});
