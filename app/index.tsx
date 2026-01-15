import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { THEME } from "./theme/colors";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>CricScore 🏏</Text>
        <Text style={styles.subtitle}>Local Cricket Scorebook</Text>
      </View>

      {/* ACTIONS */}
      <View>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/match-setup")}
        >
          <Text style={styles.primaryText}>Start New Match</Text>
          <Text style={styles.subText}>Set teams & overs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push("/history")}
        >
          <Text style={styles.secondaryText}>Match History</Text>
          <Text style={styles.subText}>Previous matches</Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <Text style={styles.footer}>
        Offline • Fast • Made for Gully Cricket
      </Text>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
    padding: 20,
    justifyContent: "space-between",
  },

  header: {
    marginTop: 40,
    alignItems: "center",
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: THEME.primary,
  },

  subtitle: {
    fontSize: 14,
    color: THEME.muted,
    marginTop: 6,
  },

  primaryBtn: {
    backgroundColor: THEME.primary,
    padding: 22,
    borderRadius: 16,
    marginBottom: 16,
  },

  primaryText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  secondaryBtn: {
    backgroundColor: THEME.card,
    padding: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.border,
  },

  secondaryText: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  subText: {
    color: THEME.muted,
    textAlign: "center",
    marginTop: 6,
    fontSize: 12,
  },

  footer: {
    color: THEME.muted,
    textAlign: "center",
    fontSize: 12,
    marginBottom: 16,
  },
});
