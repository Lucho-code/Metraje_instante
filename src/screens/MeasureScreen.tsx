import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Text, Pressable, Alert } from 'react-native';
import { ViroARSceneNavigator } from '@reactvision/react-viro';
import { SafeAreaView } from 'react-native-safe-area-context';
import MeasureARScene, { MeasureMode } from '../ar/MeasureARScene';
import { Point3D, distance3D, polygonArea3D, formatLength, formatArea } from '../utils/geometry';
import { saveMeasurement } from '../utils/storage';
import { colors } from '../theme/colors';

export default function MeasureScreen({ navigation }: any) {
  const [mode, setMode] = useState<MeasureMode>('distance');
  const [points, setPoints] = useState<Point3D[]>([]);
  const [trackingReady, setTrackingReady] = useState(false);
  const [surfaceFound, setSurfaceFound] = useState(false);

  const handleAddPoint = (point: Point3D) => {
    setPoints((prev) => {
      if (mode === 'distance') {
        if (prev.length >= 2) return [point];
        return [...prev, point];
      }
      return [...prev, point];
    });
  };

  const result = useMemo(() => {
    if (mode === 'distance' && points.length === 2) {
      const raw = distance3D(points[0], points[1]);
      return { label: 'Distancia', value: formatLength(raw), raw };
    }
    if (mode === 'area' && points.length >= 3) {
      const raw = polygonArea3D(points);
      return { label: 'Área', value: formatArea(raw), raw };
    }
    return null;
  }, [mode, points]);

  const handleReset = () => setPoints([]);

  const handleModeChange = (next: MeasureMode) => {
    setMode(next);
    setPoints([]);
  };

  const handleUndo = () => setPoints((prev) => prev.slice(0, -1));

  const handleSave = async () => {
    if (!result) return;
    await saveMeasurement({
      id: `${Date.now()}`,
      mode,
      value: result.raw,
      points,
      createdAt: new Date().toISOString(),
    });
    Alert.alert('Guardado', 'La medición se guardó en el historial.', [
      { text: 'Seguir midiendo', onPress: handleReset },
      { text: 'Ver historial', onPress: () => navigation.navigate('History') },
    ]);
  };

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus
        initialScene={{
          scene: () => (
            <MeasureARScene
              mode={mode}
              points={points}
              onAddPoint={handleAddPoint}
              onTrackingReady={setTrackingReady}
              onSurfaceFound={setSurfaceFound}
            />
          ),
        }}
        style={styles.arView}
      />

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topBar}>
          <ModeButton label="Distancia" active={mode === 'distance'} onPress={() => handleModeChange('distance')} />
          <ModeButton label="Área" active={mode === 'area'} onPress={() => handleModeChange('area')} />
        </View>

        {!trackingReady && (
          <Hint text="Movés el celular despacio para calibrar la cámara…" />
        )}
        {trackingReady && !surfaceFound && (
          <Hint text="Apuntá a una superficie plana (piso, mesa, pared) hasta que se detecte." />
        )}
        {surfaceFound && points.length === 0 && (
          <Hint
            text={
              mode === 'distance'
                ? 'Tocá dos puntos sobre la superficie para medir la distancia.'
                : 'Tocá los vértices del área. Cuando tengas al menos 3, presioná Guardar.'
            }
          />
        )}

        <View style={styles.bottomBar}>
          {result && (
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>{result.label}</Text>
              <Text style={styles.resultValue}>{result.value}</Text>
            </View>
          )}
          <View style={styles.actionsRow}>
            <ActionButton label="Deshacer" onPress={handleUndo} disabled={points.length === 0} />
            <ActionButton label="Reiniciar" onPress={handleReset} disabled={points.length === 0} />
            <ActionButton label="Guardar" onPress={handleSave} disabled={!result} primary />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Hint({ text }: { text: string }) {
  return (
    <View style={styles.hintBanner}>
      <Text style={styles.hintText}>{text}</Text>
    </View>
  );
}

function ModeButton({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.modeButton, active && styles.modeButtonActive]}>
      <Text style={[styles.modeButtonText, active && styles.modeButtonTextActive]}>{label}</Text>
    </Pressable>
  );
}

function ActionButton({
  label,
  onPress,
  disabled,
  primary,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.actionButton, primary && styles.actionButtonPrimary, disabled && styles.actionButtonDisabled]}
    >
      <Text style={[styles.actionButtonText, primary && styles.actionButtonTextPrimary]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  arView: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between' },
  topBar: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 12 },
  modeButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)' },
  modeButtonActive: { backgroundColor: colors.primary },
  modeButtonText: { color: '#fff', fontWeight: '600' },
  modeButtonTextActive: { color: '#fff' },
  hintBanner: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 12,
  },
  hintText: { color: '#fff', textAlign: 'center' },
  bottomBar: { paddingHorizontal: 20, paddingBottom: 24 },
  resultCard: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabel: { color: '#ccc', fontSize: 14 },
  resultValue: { color: '#fff', fontSize: 32, fontWeight: '700' },
  actionsRow: { flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
  actionButton: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center' },
  actionButtonPrimary: { backgroundColor: colors.primary },
  actionButtonDisabled: { opacity: 0.4 },
  actionButtonText: { color: '#fff', fontWeight: '600' },
  actionButtonTextPrimary: { color: '#fff' },
});
