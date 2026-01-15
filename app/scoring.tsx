/**
 * =====================================================
 * CRICSCORE – LIVE SCORING SCREEN
 * =====================================================
 * Handles:
 * - Live ball-by-ball scoring
 * - Extras (WD, NB, BYE, LB, Overthrow)
 * - Wickets & next batsman
 * - Bowler change after over
 * - Undo last ball
 * - Auto match finish (chase / overs)
 */

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import { THEME } from "./theme/colors";
import { addBall } from "./engine/matchEngine";
import { Match, TeamSide } from "./engine/types";

import ChangeBowlerModal from "./components/ChangeBowlerModal";
import NextBatsmanModal from "./components/NextBatsmanModal";
import AdvancedBallModal from "./components/AdvancedBallModal";

import { nanoid } from "nanoid/non-secure";

/* =====================================================
   MATCH CREATION
   ===================================================== */

function createInitialMatch(params: any): Match {
  const playersA: string[] = params.playersA
    ? JSON.parse(params.playersA)
    : ["Player A1", "Player A2"];

  const playersB: string[] = params.playersB
    ? JSON.parse(params.playersB)
    : ["Player B1", "Player B2"];

  const teamAPlayers = playersA.map((name, i) => ({
    id: `A${i + 1}`,
    name,
  }));

  const teamBPlayers = playersB.map((name, i) => ({
    id: `B${i + 1}`,
    name,
  }));

  const battingFirst: TeamSide =
    params.decision === "BAT"
      ? params.tossWinner
      : params.tossWinner === "A"
      ? "B"
      : "A";

  return {
    id: nanoid(),
    oversLimit: Number(params.overs),
    teams: {
      A: { id: "A", name: params.teamA || "Team A", players: teamAPlayers },
      B: { id: "B", name: params.teamB || "Team B", players: teamBPlayers },
    },
    toss: {
      winner: params.tossWinner,
      decision: params.decision,
    },
    innings: [
      createInnings(
        battingFirst,
        battingFirst === "A" ? "B" : "A",
        battingFirst === "A" ? teamAPlayers : teamBPlayers,
        battingFirst === "A" ? teamBPlayers : teamAPlayers
      ),
      createInnings(
        battingFirst === "A" ? "B" : "A",
        battingFirst,
        battingFirst === "A" ? teamBPlayers : teamAPlayers,
        battingFirst === "A" ? teamAPlayers : teamBPlayers
      ),
    ],
    currentInnings: 1,
    status: "LIVE",
    createdAt: Date.now(),
  };
}

/* =====================================================
   INNINGS + PLAYER HELPERS
   ===================================================== */

function createInnings(
  battingTeam: TeamSide,
  bowlingTeam: TeamSide,
  batPlayers: any[],
  bowlPlayers: any[]
) {
  return {
    battingTeam,
    bowlingTeam,
    totalRuns: 0,
    wickets: 0,
    balls: 0,
    deliveries: [],
    batsmen: {
      [batPlayers[0].id]: createBatsman(batPlayers[0]),
      [batPlayers[1].id]: createBatsman(batPlayers[1]),
    },
    bowlers: {
      [bowlPlayers[0].id]: createBowler(bowlPlayers[0]),
    },
    partnerships: [
      {
        batsman1Id: batPlayers[0].id,
        batsman2Id: batPlayers[1].id,
        runs: 0,
        balls: 0,
      },
    ],
  };
}

function createBatsman(player: any) {
  return {
    playerId: player.id,
    name: player.name,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    strikeRate: 0,
    isOut: false,
  };
}

function createBowler(player: any) {
  return {
    playerId: player.id,
    name: player.name,
    balls: 0,
    runs: 0,
    wickets: 0,
    maidens: 0,
    economy: 0,
  };
}

/* =====================================================
   SCORING COMPONENT
   ===================================================== */

export default function Scoring() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const [match, setMatch] = useState<Match>(
    createInitialMatch(params)
  );
  const [historyStack, setHistoryStack] = useState<Match[]>([]);

  const innings = match.innings[match.currentInnings - 1];
  const partnership = innings.partnerships[innings.partnerships.length - 1];

  const strikerId = partnership.batsman1Id;
  const nonStrikerId = partnership.batsman2Id;

  const [currentBowler, setCurrentBowler] = useState(
    Object.keys(innings.bowlers)[0]
  );

  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [showBatsmanModal, setShowBatsmanModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const oversText = `${Math.floor(innings.balls / 6)}.${innings.balls % 6}`;

  /* =====================================================
     BASIC BALL
     ===================================================== */

  const playBall = (runs: number, extra?: "WD" | "NB", wicket?: boolean) => {
    try {
      setHistoryStack((prev) => [...prev, JSON.parse(JSON.stringify(match))]);

      const beforeBalls = innings.balls;

      const updated = addBall(match, {
        strikerId,
        nonStrikerId,
        bowlerId: currentBowler,
        runsOffBat: runs,
        extras:
          extra === "WD"
            ? { wide: 1 }
            : extra === "NB"
            ? { noBall: 1 }
            : {},
        countsAsBall: !extra,
        dismissal: wicket
          ? { type: "BOWLED", playerOutId: strikerId }
          : undefined,
      });

      const newInnings = updated.innings[updated.currentInnings - 1];

      if (wicket) setShowBatsmanModal(true);

      if (
        Math.floor(beforeBalls / 6) !==
        Math.floor(newInnings.balls / 6)
      ) {
        setShowBowlerModal(true);
      }

      setMatch({ ...updated });

      if (updated.status === "COMPLETED") {
        router.replace({
          pathname: "/scorecard",
          params: { match: JSON.stringify(updated) },
        });
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  /* =====================================================
     ADVANCED BALL
     ===================================================== */

  const playBallAdvanced = (data: any) => {
    try {
      setHistoryStack((prev) => [...prev, JSON.parse(JSON.stringify(match))]);

      const extras: any = {};
      let countsAsBall = true;

      if (data.extraType === "WD") {
        extras.wide = 1 + data.extraRuns;
        countsAsBall = false;
      }

      if (data.extraType === "NB") {
        extras.noBall = 1 + data.extraRuns;
        countsAsBall = false;
      }

      if (data.extraType === "BYE") extras.bye = data.extraRuns;
      if (data.extraType === "LB") extras.legBye = data.extraRuns;
      if (data.overthrow > 0) extras.overthrow = data.overthrow;

      const updated = addBall(match, {
        strikerId,
        nonStrikerId,
        bowlerId: currentBowler,
        runsOffBat: data.runsOffBat,
        extras,
        countsAsBall,
        dismissal: data.runOut
          ? { type: "RUN_OUT", playerOutId: strikerId }
          : undefined,
      });

      setMatch({ ...updated });
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  /* =====================================================
     UNDO
     ===================================================== */

  const undoLastBall = () => {
    if (!historyStack.length) {
      Alert.alert("Nothing to undo");
      return;
    }
    setMatch(historyStack[historyStack.length - 1]);
    setHistoryStack((prev) => prev.slice(0, -1));
  };

  /* =====================================================
     UI
     ===================================================== */

  return (
    <View style={styles.container}>
      {/* SCORE STRIP */}
      <View style={styles.strip}>
        <Text style={styles.team}>
          {match.teams[innings.battingTeam].name}
        </Text>
        <Text style={styles.score}>
          {innings.totalRuns}/{innings.wickets}
        </Text>
        <Text style={styles.overs}>🕒 {oversText}</Text>
      </View>

      {/* TARGET / RRR */}
      {match.currentInnings === 2 && (
        <Text style={styles.rrr}>
          Target: {match.innings[0].totalRuns + 1}
        </Text>
      )}

      {/* STRIKER */}
      <View style={styles.card}>
        <Text style={styles.label}>Striker</Text>
        <Text style={styles.value}>
          {innings.batsmen[strikerId]?.name} —{" "}
          {innings.batsmen[strikerId]?.runs} (
          {innings.batsmen[strikerId]?.balls})
        </Text>
      </View>

      {/* RUN BUTTONS */}
      <View style={styles.grid}>
        {[0, 1, 2, 3, 4, 6].map((r) => (
          <Btn key={r} text={String(r)} onPress={() => playBall(r)} />
        ))}
        <Btn text="WD" color={THEME.secondary} onPress={() => playBall(0, "WD")} />
        <Btn text="NB" color={THEME.secondary} onPress={() => playBall(0, "NB")} />
        <Btn text="W" color={THEME.danger} onPress={() => playBall(0, undefined, true)} />
      </View>

      {/* ADVANCED */}
      <TouchableOpacity
        style={styles.advancedBtn}
        onPress={() => setShowAdvanced(true)}
      >
        <Text style={styles.advancedText}>Advanced Ball</Text>
      </TouchableOpacity>

      {/* MODALS */}
      <Modal visible={showBowlerModal} transparent animationType="slide">
        <ChangeBowlerModal
          bowlers={match.teams[innings.bowlingTeam].players}
          onSelect={(id) => {
            if (!innings.bowlers[id]) {
              const p = match.teams[innings.bowlingTeam].players.find(
                (x) => x.id === id
              );
              innings.bowlers[id] = createBowler(p);
            }
            setCurrentBowler(id);
            setShowBowlerModal(false);
          }}
        />
      </Modal>

      <Modal visible={showBatsmanModal} transparent animationType="slide">
        <NextBatsmanModal
          players={match.teams[innings.battingTeam].players.filter(
            (p) => !innings.batsmen[p.id]
          )}
          onSelect={(id) => {
            const p = match.teams[innings.battingTeam].players.find(
              (x) => x.id === id
            );
            innings.batsmen[id] = createBatsman(p);
            innings.partnerships.push({
              batsman1Id: nonStrikerId,
              batsman2Id: id,
              runs: 0,
              balls: 0,
            });
            setShowBatsmanModal(false);
          }}
        />
      </Modal>

      <Modal visible={showAdvanced} transparent animationType="slide">
        <AdvancedBallModal
          onCancel={() => setShowAdvanced(false)}
          onConfirm={(data) => {
            setShowAdvanced(false);
            playBallAdvanced(data);
          }}
        />
      </Modal>
    </View>
  );
}

/* =====================================================
   UI HELPERS
   ===================================================== */

function Btn({ text, onPress, color = THEME.primary }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btn, { backgroundColor: color }]}
    >
      <Text style={styles.btnText}>{text}</Text>
    </TouchableOpacity>
  );
}

/* =====================================================
   STYLES
   ===================================================== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg, padding: 16 },
  strip: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  team: { color: THEME.text, fontSize: 18, fontWeight: "bold" },
  score: { color: THEME.primary, fontSize: 28, fontWeight: "bold" },
  overs: { color: THEME.muted },
  rrr: { color: THEME.muted, marginBottom: 10 },
  card: { backgroundColor: THEME.card, padding: 14, borderRadius: 12, marginBottom: 16 },
  label: { color: THEME.muted, fontSize: 12 },
  value: { color: THEME.text, fontSize: 16, fontWeight: "bold" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  btn: { width: "30%", padding: 16, borderRadius: 14, marginBottom: 12, alignItems: "center" },
  btnText: { color: "#000", fontSize: 16, fontWeight: "bold" },
  advancedBtn: { marginTop: 10, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: THEME.primary, alignItems: "center" },
  advancedText: { color: THEME.primary, fontWeight: "bold" },
});
