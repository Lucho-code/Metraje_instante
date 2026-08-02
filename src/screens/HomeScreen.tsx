import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Metraje Instante</Text>
        <Text style={styles.subtitle}>
          Medí distancias y áreas con la cámara, en el momento.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Measure')}>
          <Text style={styles.primaryButtonText}>Medir con la cámara</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('History')}>
          <Text style={styles.secondaryButtonText}>Ver historial</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'space-between', padding: 24 },
  header: { marginTop: 40 },
  title: { color: colors.text, fontSize: 32, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: 16, marginTop: 8 },
  actions: { marginBottom: 24, gap: 12 },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  secondaryButton: { backgroundColor: colors.surface, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  secondaryButtonText: { color: colors.text, fontSize: 16, fontWeight: '600' },
});
