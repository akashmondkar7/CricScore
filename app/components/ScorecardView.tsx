import { View, Text, StyleSheet } from "react-native";
import { THEME } from "../theme/colors";

export default function ScorecardView({
  teamA,
  teamB,
  inn1,
  inn2,
  result,
}: any) {
  return (
    <View style={styles.wrapper}>
      {/* HEADER */}
      <Text style={styles.title}>CricScore 🏏</Text>

      {/* INNINGS 1 */}
      <InningsBlock title={teamA} innings={inn1} />

      {/* INNINGS 2 */}
      <InningsBlock title={teamB} innings={inn2} />

      {/* RESULT */}
      <View style={styles.resultBox}>
        <Text style={styles.resultText}>{result}</Text>
      </View>
    </View>
  );
}

/* ================= INNINGS BLOCK ================= */

function InningsBlock({ title, innings }: any) {
  return (
    <View style={styles.card}>
      <Text style={styles.teamTitle}>{title}</Text>
      <Text style={styles.score}>
        {innings.totalRuns}/{innings.wickets} (
        {Math.floor(innings.balls / 6)}.{innings.balls % 6})
      </Text>

      <BattingTable batsmen={innings.batsmen} />
      <BowlingTable bowlers={innings.bowlers} />
    </View>
  );
}

/* ================= BATTING TABLE ================= */

function BattingTable({ batsmen }: any) {
  const list = Object.values(batsmen);

  return (
    <View style={styles.table}>
      <TableHeader headers={["BATTER", "R", "B", "4s", "6s", "SR"]} />
      {list.map((b: any) => (
        <TableRow
          key={b.playerId}
          cols={[
            b.playerId,
            b.runs,
            b.balls,
            b.fours,
            b.sixes,
            b.strikeRate.toFixed(1),
          ]}
        />
      ))}
    </View>
  );
}

/* ================= BOWLING TABLE ================= */

function BowlingTable({ bowlers }: any) {
  const list = Object.values(bowlers);

  return (
    <View style={styles.table}>
      <TableHeader headers={["BOWLER", "O", "R", "W", "ECO"]} />
      {list.map((b: any) => (
        <TableRow
          key={b.playerId}
          cols={[
            b.playerId,
            `${Math.floor(b.balls / 6)}.${b.balls % 6}`,
            b.runs,
            b.wickets,
            b.economy.toFixed(1),
          ]}
        />
      ))}
    </View>
  );
}

/* ================= TABLE HELPERS ================= */

function TableHeader({ headers }: any) {
  return (
    <View style={styles.rowHeader}>
      {headers.map((h: string) => (
        <Text key={h} style={styles.headerText}>
          {h}
        </Text>
      ))}
    </View>
  );
}

function TableRow({ cols }: any) {
  return (
    <View style={styles.row}>
      {cols.map((c: any, i: number) => (
        <Text key={i} style={styles.cell}>
          {c}
        </Text>
      ))}
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: THEME.bg,
    padding: 16,
    borderRadius: 20,
  },

  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: THEME.primary,
    marginBottom: 16,
  },

  card: {
    backgroundColor: THEME.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },

  teamTitle: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: "bold",
  },

  score: {
    color: THEME.primary,
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 8,
  },

  table: {
    marginTop: 10,
  },

  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: THEME.border,
    paddingBottom: 6,
    marginBottom: 6,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },

  headerText: {
    color: THEME.muted,
    fontWeight: "bold",
    fontSize: 12,
    width: "16%",
  },

  cell: {
    color: THEME.text,
    fontSize: 12,
    width: "16%",
  },

  resultBox: {
    backgroundColor: THEME.primary,
    padding: 14,
    borderRadius: 14,
  },

  resultText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#000",
  },
});
