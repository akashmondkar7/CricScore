import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { THEME } from "../theme/colors";

export default function TeamSetup() {
  const router = useRouter();

  const [teamA, setTeamA] = useState("Team A");
  const [teamB, setTeamB] = useState("Team B");

  const [playersA, setPlayersA] = useState([""]);
  const [playersB, setPlayersB] = useState([""]);

  const addPlayer = (team: "A" | "B") => {
    team === "A"
      ? setPlayersA([...playersA, ""])
      : setPlayersB([...playersB, ""]);
  };

  const updatePlayer = (team: "A" | "B", index: number, value: string) => {
    const list = team === "A" ? [...playersA] : [...playersB];
    list[index] = value;
    team === "A" ? setPlayersA(list) : setPlayersB(list);
  };

  const startMatch = () => {
    router.push({
      pathname: "/scoring",
      params: {
        teamA,
        teamB,
        playersA: JSON.stringify(playersA.filter(Boolean)),
        playersB: JSON.stringify(playersB.filter(Boolean)),
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Team Setup 🏏</Text>

      {/* TEAM A */}
      <Text style={styles.teamLabel}>Team A Name</Text>
      <TextInput
        style={styles.input}
        value={teamA}
        onChangeText={setTeamA}
      />

      {playersA.map((p, i) => (
        <TextInput
          key={i}
          style={styles.input}
          placeholder={`Player ${i + 1}`}
          placeholderTextColor={THEME.muted}
          value={p}
          onChangeText={(v) => updatePlayer("A", i, v)}
        />
      ))}

      <TouchableOpacity onPress={() => addPlayer("A")}>
        <Text style={styles.add}>+ Add Player</Text>
      </TouchableOpacity>

      {/* TEAM B */}
      <Text style={styles.teamLabel}>Team B Name</Text>
      <TextInput
        style={styles.input}
        value={teamB}
        onChangeText={setTeamB}
      />

      {playersB.map((p, i) => (
        <TextInput
          key={i}
          style={styles.input}
          placeholder={`Player ${i + 1}`}
          placeholderTextColor={THEME.muted}
          value={p}
          onChangeText={(v) => updatePlayer("B", i, v)}
        />
      ))}

      <TouchableOpacity onPress={() => addPlayer("B")}>
        <Text style={styles.add}>+ Add Player</Text>
      </TouchableOpacity>

      {/* START */}
      <TouchableOpacity style={styles.startBtn} onPress={startMatch}>
        <Text style={styles.startText}>Start Match</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: THEME.primary,
    marginBottom: 16,
    textAlign: "center",
  },

  teamLabel: {
    color: THEME.text,
    marginTop: 16,
    marginBottom: 6,
    fontWeight: "bold",
  },

  input: {
    backgroundColor: THEME.card,
    color: THEME.text,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },

  add: {
    color: THEME.secondary,
    marginBottom: 16,
    fontWeight: "bold",
  },

  startBtn: {
    backgroundColor: THEME.primary,
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
  },

  startText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
});
