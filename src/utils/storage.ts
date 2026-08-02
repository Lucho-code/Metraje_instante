import AsyncStorage from '@react-native-async-storage/async-storage';
import { Measurement } from './types';

const STORAGE_KEY = '@metraje_instante/measurements';

export async function getMeasurements(): Promise<Measurement[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveMeasurement(measurement: Measurement): Promise<void> {
  const existing = await getMeasurements();
  existing.unshift(measurement);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export async function deleteMeasurement(id: string): Promise<void> {
  const existing = await getMeasurements();
  const filtered = existing.filter((m) => m.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export async function clearMeasurements(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
