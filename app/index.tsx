import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0A1A44",
        padding: 20,
      }}
    >
      {/* Header */}
      <View style={{ marginTop: 40, marginBottom: 30 }}>
        <Text
          style={{
            fontSize: 36,
            fontWeight: "bold",
            color: "#FFFFFF",
          }}
        >
          CricScore 🏏
        </Text>

        <Text
          style={{
            fontSize: 15,
            color: "#CBD5E1",
            marginTop: 6,
          }}
        >
          Your offline cricket scorebook
        </Text>
      </View>

      {/* Hero Card */}
      <View
        style={{
          backgroundColor: "#102A6D",
          borderRadius: 20,
          padding: 20,
          marginBottom: 30,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 6,
          }}
        >
          Ready for next match?
        </Text>

        <Text
          style={{
            color: "#CBD5E1",
            fontSize: 14,
          }}
        >
          Start scoring instantly. No login. No internet.
        </Text>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
        style={{
          backgroundColor: "#FF9933",
          borderRadius: 18,
          paddingVertical: 22,
          marginBottom: 18,
        }}
        onPress={() => router.push("/new-match")}
      >
        <Text
          style={{
            color: "#0A1A44",
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          🏏 Start New Match
        </Text>

        <Text
          style={{
            color: "#0A1A44",
            textAlign: "center",
            marginTop: 4,
            fontSize: 13,
          }}
        >
          Teams • Overs • Toss
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#1E40AF",
          borderRadius: 18,
          paddingVertical: 22,
        }}
        onPress={() => router.push("/history")}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 18,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          📊 Match History
        </Text>

        <Text
          style={{
            color: "#CBD5E1",
            textAlign: "center",
            marginTop: 4,
            fontSize: 13,
          }}
        >
          View completed matches
        </Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={{ marginTop: "auto", marginBottom: 20 }}>
        <Text
          style={{
            color: "#94A3B8",
            textAlign: "center",
            fontSize: 12,
          }}
        >
          Built for local cricket • Works offline 🇮🇳
        </Text>
      </View>
    </View>
  );
}
