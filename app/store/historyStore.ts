import AsyncStorage from "@react-native-async-storage/async-storage";
import { Match } from "../engine/types";

const KEY = "CRICSCORE_HISTORY";

export async function saveMatch(match: Match) {
  const old = await getMatches();
  const updated = [match, ...old];
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}

export async function getMatches(): Promise<Match[]> {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}
