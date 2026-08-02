# Metraje Instante

MVP de una app móvil (iOS/Android) para medir **distancias** y **áreas** en Realidad Aumentada usando la cámara del celular, con historial de mediciones guardadas localmente. Inspirada en la propuesta de `@srmeasure`.

## Stack

- **Expo** (React Native + TypeScript)
- **[ViroReact](https://github.com/ReactVision/viro)** (`@reactvision/react-viro`) para AR real (ARKit en iOS / ARCore en Android): detección de planos, colocación de puntos 3D y líneas.
- **React Navigation** para las 3 pantallas (Inicio, Medir, Historial).
- **AsyncStorage** para guardar el historial de mediciones en el dispositivo.

## Cómo funciona

1. **Inicio** → dos botones: "Medir con la cámara" y "Ver historial".
2. **Medir** → abre la cámara en modo AR. Cuando detecta una superficie (piso, mesa, pared), el usuario toca sobre ella:
   - Modo **Distancia**: 2 toques = distancia entre esos dos puntos.
   - Modo **Área**: 3 o más toques = área del polígono (fórmula de Newell, soporta superficies levemente inclinadas).
   - Botones para deshacer el último punto, reiniciar, y guardar el resultado en el historial.
3. **Historial** → lista de mediciones guardadas, con fecha, valor y opción de borrar.

## ✅ Qué se probó y qué no

Este entorno no tiene cámara ni puede compilar apps nativas iOS/Android, así que **la app en sí nunca se ejecutó en un dispositivo real**. Lo que sí se verificó localmente, contra el paquete real instalado (SDK 57 / React Native 0.86.2 / `@reactvision/react-viro` 2.57.5):

- `npm install` sin conflictos de dependencias.
- `tsc --noEmit` (chequeo de tipos) sin errores, incluyendo las props de ViroReact usadas en `MeasureARScene.tsx` (`onClickState`, `onAnchorFound`, tipos de posición 3D) contra los `.d.ts` reales del paquete — no son una suposición, se confirmaron línea por línea.
- `npx expo config` y `expo-doctor` (18/20 checks; los 2 que fallan son validaciones contra servidores de Expo, inalcanzables desde este entorno — no son del proyecto).
- `npx expo export --platform android`: Metro bundlea las 947 dependencias sin errores (código, navegación, assets de Viro incluidos).

Lo que **falta probar** y solo se puede hacer en un dispositivo real:

1. **Comportamiento en cámara real:** que el toque sobre el `ViroQuad` invisible efectivamente devuelva la posición 3D esperada, que la detección de plano sea estable, y que distancia/área calculen bien en la práctica.
2. **No funciona en Expo Go** — ViroReact requiere *New Architecture* y módulos nativos, así que hace falta un *development build* propio:
   ```bash
   npm install
   npx eas login
   npx eas build --profile development --platform ios      # o android
   ```
3. **Versiones de Expo/RN avanzan rápido.** Si pasó tiempo desde que se generó esto, correr `npx expo install --fix` (requiere acceso a `api.expo.dev`, bloqueado en el entorno donde se armó el proyecto pero disponible en una máquina normal) para re-alinear versiones.

## Limitaciones conocidas del MVP

- La app se ancla al *primer* plano detectado (ideal para medir un piso, mesa o pared específica). No soporta todavía "tocar en cualquier punto del aire" tipo escaneo LiDAR de la app Measure de Apple — eso requeriría un módulo nativo adicional de ray-casting, buen paso siguiente si esto valida bien.
- Sin ícono/splash propio todavía. Agregá tus propios `assets/icon.png` y `assets/splash.png` y referencialos en `app.json` antes de publicar en las stores.

## Estructura

```
App.tsx
src/
  navigation/AppNavigator.tsx
  screens/HomeScreen.tsx
  screens/MeasureScreen.tsx      # overlay de UI + resultado + botones
  screens/HistoryScreen.tsx
  ar/MeasureARScene.tsx          # escena AR: detección de plano, toques, líneas
  utils/geometry.ts              # distancia y área en 3D
  utils/storage.ts               # AsyncStorage CRUD
  utils/types.ts
  theme/colors.ts
```

## Próximos pasos sugeridos

- Probar en un dispositivo real (iOS con ARKit o Android con ARCore) y ajustar la API de Viro si hiciera falta.
- Agregar ícono, splash y nombre final para publicar en TestFlight / Play Console interno.
- Exportar mediciones (compartir como texto/imagen).
- Soporte multi-plano / medición en el aire (requiere ray-casting nativo).
