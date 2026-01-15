import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useState } from "react";
import { THEME } from "../theme/colors";

export default function AdvancedBallModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (data: any) => void;
  onCancel: () => void;
}) {
  const [runsOffBat, setRunsOffBat] = useState("0");
  const [extraType, setExtraType] = useState<
    "NONE" | "WD" | "NB" | "BYE" | "LB"
  >("NONE");
  const [extraRuns, setExtraRuns] = useState("0");
  const [overthrow, setOverthrow] = useState("0");
  const [runOut, setRunOut] = useState(false);

  const submit = () => {
    onConfirm({
      runsOffBat: Number(runsOffBat),
      extraType,
      extraRuns: Number(extraRuns),
      overthrow: Number(overthrow),
      runOut,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Advanced Ball</Text>

      {/* RUNS OFF BAT */}
      <Text style={styles.label}>Runs off bat</Text>
      <TextInput
        value={runsOffBat}
        onChangeText={setRunsOffBat}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* EXTRAS */}
      <Text style={styles.label}>Extras</Text>
      <View style={styles.row}>
        {["NONE", "WD", "NB", "BYE", "LB"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.opt,
              extraType === t && styles.optActive,
            ]}
            onPress={() => setExtraType(t as any)}
          >
            <Text>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {extraType !== "NONE" && (
        <>
          <Text style={styles.label}>Extra runs</Text>
          <TextInput
            value={extraRuns}
            onChangeText={setExtraRuns}
            keyboardType="numeric"
            style={styles.input}
          />
        </>
      )}

      {/* OVERTHROW */}
      <Text style={styles.label}>Overthrow runs</Text>
      <TextInput
        value={overthrow}
        onChangeText={setOverthrow}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* RUN OUT */}
      <TouchableOpacity
        style={[styles.opt, runOut && styles.optActive]}
        onPress={() => setRunOut(!runOut)}
      >
        <Text>Run Out</Text>
      </TouchableOpacity>

      {/* ACTIONS */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.cancel} onPress={onCancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirm} onPress={submit}>
          <Text style={{ color: "#fff" }}>Confirm</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 14,
  },
  label: {
    marginTop: 10,
    color: THEME.muted,
  },
  input: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    justifyContent: "space-between",
  },
  opt: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 8,
    width: "30%",
    alignItems: "center",
  },
  optActive: {
    backgroundColor: THEME.primary,
  },
  cancel: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: THEME.card,
    width: "45%",
    alignItems: "center",
  },
  confirm: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: THEME.primary,
    width: "45%",
    alignItems: "center",
  },
});
