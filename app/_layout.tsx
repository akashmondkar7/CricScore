import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { THEME } from "./theme/colors";

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={THEME.bg} />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: THEME.bg },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="match-setup" />
        <Stack.Screen name="scoring" />
        <Stack.Screen name="scorecard" />
        <Stack.Screen name="history" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
});
