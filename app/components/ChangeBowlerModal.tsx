import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { THEME } from "../theme/colors";

export default function ChangeBowlerModal({
  bowlers,
  onSelect,
}: {
  bowlers: { id: string; name: string }[];
  onSelect: (id: string) => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Bowler</Text>

      {bowlers.map((b) => (
        <TouchableOpacity
          key={b.id}
          style={styles.option}
          onPress={() => onSelect(b.id)}
        >
          <Text style={styles.text}>{b.name}</Text>
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
    color: THEME.text,
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
