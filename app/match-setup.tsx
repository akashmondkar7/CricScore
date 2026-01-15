import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { THEME } from "./theme/colors";

export default function MatchSetup() {
  const router = useRouter();

  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [overs, setOvers] = useState("");
  const [tossWinner, setTossWinner] = useState<"A" | "B" | null>(null);
  const [decision, setDecision] = useState<"BAT" | "FIELD" | null>(null);

  /* ================= VALIDATION ================= */

  const startMatch = () => {
    if (!teamA.trim() || !teamB.trim()) {
      Alert.alert("Missing Teams", "Please enter both team names");
      return;
    }

    const oversNum = Number(overs);
    if (!oversNum || oversNum <= 0) {
      Alert.alert("Invalid Overs", "Please enter valid number of overs");
      return;
    }

    if (!tossWinner || !decision) {
      Alert.alert("Toss Required", "Please select toss result");
      return;
    }

    router.push({
      pathname: "/scoring",
      params: {
        teamA,
        teamB,
        overs: oversNum.toString(),
        tossWinner,
        decision,
      },
    });
  };

  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Match 🏏</Text>

      {/* TEAM INPUTS */}
      <View style={styles.card}>
        <Text style={styles.label}>Team A</Text>
        <TextInput
          value={teamA}
          onChangeText={setTeamA}
          placeholder="Enter Team A name"
          placeholderTextColor={THEME.muted}
          style={styles.input}
        />

        <Text style={styles.label}>Team B</Text>
        <TextInput
          value={teamB}
          onChangeText={setTeamB}
          placeholder="Enter Team B name"
          placeholderTextColor={THEME.muted}
          style={styles.input}
        />
      </View>

      {/* OVERS */}
      <View style={styles.card}>
        <Text style={styles.label}>Overs</Text>
        <TextInput
          value={overs}
          onChangeText={setOvers}
          keyboardType="numeric"
          placeholder="e.g. 5, 6, 10"
          placeholderTextColor={THEME.muted}
          style={styles.input}
        />
      </View>

      {/* TOSS */}
      <View style={styles.card}>
        <Text style={styles.label}>Toss Winner</Text>

        <View style={styles.row}>
          <Option
            text={teamA || "Team A"}
            active={tossWinner === "A"}
            onPress={() => setTossWinner("A")}
          />
          <Option
            text={teamB || "Team B"}
            active={tossWinner === "B"}
            onPress={() => setTossWinner("B")}
          />
        </View>

        {tossWinner && (
          <>
            <Text style={styles.label}>Decision</Text>
            <View style={styles.row}>
              <Option
                text="Bat"
                active={decision === "BAT"}
                onPress={() => setDecision("BAT")}
              />
              <Option
                text="Field"
                active={decision === "FIELD"}
                onPress={() => setDecision("FIELD")}
              />
            </View>
          </>
        )}
      </View>

      {/* START */}
      <TouchableOpacity style={styles.startBtn} onPress={startMatch}>
        <Text style={styles.startText}>Start Match</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ================= OPTION BUTTON ================= */

function Option({ text, active, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.option,
        {
          backgroundColor: active ? THEME.primary : THEME.card,
          borderColor: active ? THEME.primary : THEME.border,
        },
      ]}
    >
      <Text
        style={{
          color: active ? "#fff" : THEME.text,
          fontWeight: "bold",
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: THEME.text,
    marginBottom: 20,
    textAlign: "center",
  },

  card: {
    backgroundColor: THEME.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },

  label: {
    color: THEME.muted,
    marginBottom: 6,
    fontSize: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 10,
    padding: 12,
    color: THEME.text,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  option: {
    width: "48%",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },

  startBtn: {
    backgroundColor: THEME.primary,
    padding: 18,
    borderRadius: 18,
    marginTop: 10,
  },

  startText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});
