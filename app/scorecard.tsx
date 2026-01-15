import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ScorecardView from "./components/ScorecardView";
import { THEME } from "./theme/colors";
import { saveMatch } from "./store/historyStore";
import { useEffect, useRef } from "react";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { captureRef } from "react-native-view-shot";

export default function Scorecard() {
  const params: any = useLocalSearchParams();
  const router = useRouter();
  const viewRef = useRef(null);

  const match = JSON.parse(params.match);

  const inn1 = match.innings[0];
  const inn2 = match.innings[1];

  const result =
  inn2.totalRuns >= inn1.totalRuns + 1
    ? `${match.teams[inn2.battingTeam].name} won by ${
        match.teams[inn2.battingTeam].players.length - 1 - inn2.wickets
      } wickets`
    : `${match.teams[inn1.battingTeam].name} won by ${
        inn1.totalRuns - inn2.totalRuns
      } runs`;

  useEffect(() => {
    saveMatch({ ...match, status: "COMPLETED" });
  }, []);

  const shareImage = async () => {
    const uri = await captureRef(viewRef, { format: "png", quality: 1 });
    await Sharing.shareAsync(uri);
  };

  const downloadPDF = async () => {
    await Print.printAsync({
      html: `<h1>${result}</h1>`,
    });
  };

  return (
    <View style={styles.container}>
      <View ref={viewRef}>
        <ScorecardView
          teamA={match.teams.A.name}
          teamB={match.teams.B.name}
          inn1={inn1}
          inn2={inn2}
          result={result}
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={shareImage}>
        <Text style={styles.btnText}>📤 Share</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.outline} onPress={downloadPDF}>
        <Text style={styles.outlineText}>📄 Download PDF</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/")}>
        <Text style={styles.back}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: THEME.bg },
  btn: {
    backgroundColor: THEME.primary,
    padding: 14,
    borderRadius: 14,
    marginTop: 20,
  },
  btnText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  outline: {
    borderWidth: 1,
    borderColor: THEME.primary,
    padding: 14,
    borderRadius: 14,
    marginTop: 10,
  },
  outlineText: {
    color: THEME.primary,
    textAlign: "center",
    fontWeight: "bold",
  },
  back: {
    textAlign: "center",
    marginTop: 16,
    color: THEME.muted,
  },
});
