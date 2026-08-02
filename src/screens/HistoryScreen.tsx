import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Measurement } from '../utils/types';
import { getMeasurements, deleteMeasurement, clearMeasurements } from '../utils/storage';
import { formatLength, formatArea } from '../utils/geometry';
import { colors } from '../theme/colors';

export default function HistoryScreen() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  useFocusEffect(
    useCallback(() => {
      getMeasurements().then(setMeasurements);
    }, [])
  );

  const handleDelete = async (id: string) => {
    await deleteMeasurement(id);
    setMeasurements(await getMeasurements());
  };

  const handleClearAll = () => {
    Alert.alert('Borrar historial', '¿Seguro que querés borrar todas las mediciones guardadas?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Borrar todo',
        style: 'destructive',
        onPress: async () => {
          await clearMeasurements();
          setMeasurements([]);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Historial</Text>
        {measurements.length > 0 && (
          <Pressable onPress={handleClearAll}>
            <Text style={styles.clearAll}>Borrar todo</Text>
          </Pressable>
        )}
      </View>

      {measurements.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Todavía no guardaste ninguna medición.</Text>
        </View>
      ) : (
        <FlatList
          data={measurements}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.cardMode}>{item.mode === 'distance' ? 'Distancia' : 'Área'}</Text>
                <Text style={styles.cardValue}>
                  {item.mode === 'distance' ? formatLength(item.value) : formatArea(item.value)}
                </Text>
                <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleString('es-AR')}</Text>
              </View>
              <Pressable onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteText}>Eliminar</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { color: colors.text, fontSize: 24, fontWeight: '800' },
  clearAll: { color: colors.primary, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: colors.textMuted, fontSize: 16 },
  list: { gap: 12 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardMode: { color: colors.textMuted, fontSize: 13 },
  cardValue: { color: colors.text, fontSize: 22, fontWeight: '700', marginTop: 2 },
  cardDate: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  deleteText: { color: colors.danger, fontWeight: '600' },
});
