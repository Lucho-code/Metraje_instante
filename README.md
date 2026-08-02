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

## ⚠️ Importante — léase antes de correr el proyecto

Esta app **no se probó en un dispositivo físico** (el entorno donde se generó no tiene cámara ni puede compilar apps nativas iOS/Android). Antes de considerarla terminada:

1. **No funciona en Expo Go.** ViroReact requiere módulos nativos, así que hace falta un *development build* propio:
   ```bash
   npm install
   npx expo install --fix        # alinea versiones de Expo/RN a las disponibles hoy
   npx eas build --profile development --platform ios      # o android
   ```
   (Necesitás una cuenta de Expo/EAS gratuita: `npx eas login`.)

2. **Las versiones en `package.json` son un punto de partida, no verdad absoluta.** Las versiones de Expo/React Native avanzan rápido; corré `npx expo install --fix` apenas clones el repo para que Expo CLI resuelva las versiones compatibles vigentes.

3. **La lógica de hit-testing en `src/ar/MeasureARScene.tsx`** usa el patrón estándar de la comunidad ViroReact (un `ViroQuad` invisible apoyado sobre el plano detectado, con `onClickState` para capturar el toque en coordenadas 3D). No pude verificar esta API contra la documentación oficial en vivo (bloqueada para scraping automático) — está basada en mi conocimiento del proyecto y en patrones públicos de apps de "regla AR" con Viro. **Verificalo contra la [documentación oficial](https://viro-community.readme.io/) y el [starter kit oficial de Expo+TS](https://github.com/ReactVision/expo-starter-kit-typescript) antes de dar por bueno el comportamiento**, especialmente si algo no compila o el evento de toque no trae la posición esperada.

4. **Limitación conocida del MVP:** la app se ancla al *primer* plano detectado (ideal para medir un piso, mesa o pared específica). No soporta todavía "tocar en cualquier punto del aire" tipo escaneo LiDAR de la app Measure de Apple — eso requeriría un módulo nativo adicional de ray-casting, buen paso siguiente si esto valida bien.

5. **Sin ícono/splash propio todavía.** Agregá tus propios `assets/icon.png` y `assets/splash.png` y referencialos en `app.json` antes de publicar en las stores.

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
