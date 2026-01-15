import { View, Text, FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getMatches } from "./store/historyStore";
import { THEME } from "./theme/colors";

export default function History() {
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    getMatches().then(setMatches);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match History</Text>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>
              {item.teams.A.name} vs {item.teams.B.name}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  card: {
    backgroundColor: THEME.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  text: { color: THEME.text },
});
