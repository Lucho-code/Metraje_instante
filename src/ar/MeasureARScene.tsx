import React, { useCallback, useState } from 'react';
import {
  ViroARScene,
  ViroARPlane,
  ViroQuad,
  ViroSphere,
  ViroPolyline,
  ViroTrackingStateConstants,
  ViroMaterials,
} from '@reactvision/react-viro';
import { Point3D } from '../utils/geometry';

ViroMaterials.createMaterials({
  markerPoint: { diffuseColor: '#FF6B4A' },
  activeLine: { diffuseColor: '#5A9BFF' },
});

export type MeasureMode = 'distance' | 'area';

type Props = {
  mode: MeasureMode;
  points: Point3D[];
  onAddPoint: (point: Point3D) => void;
  onTrackingReady: (ready: boolean) => void;
  onSurfaceFound: (found: boolean) => void;
};

// Tamaño (en metros) de la superficie invisible de toque que se apoya sobre
// el primer plano detectado. Se agranda más allá del plano físico real que
// devuelve ARKit/ARCore para poder tocar más allá del borde detectado
// (ej. medir un ambiente completo aunque el piso detectado sea chico al inicio).
const TOUCH_SURFACE_SIZE = 6;

const MeasureARScene: React.FC<Props> = ({
  mode,
  points,
  onAddPoint,
  onTrackingReady,
  onSurfaceFound,
}) => {
  const [surfaceReady, setSurfaceReady] = useState(false);

  const handleTrackingUpdated = useCallback(
    (state: any) => {
      onTrackingReady(state === ViroTrackingStateConstants.TRACKING_NORMAL);
    },
    [onTrackingReady]
  );

  const handleAnchorFound = useCallback(() => {
    setSurfaceReady(true);
    onSurfaceFound(true);
  }, [onSurfaceFound]);

  const handleTap = useCallback(
    (_stateValue: number, position: [number, number, number]) => {
      onAddPoint({ x: position[0], y: position[1], z: position[2] });
    },
    [onAddPoint]
  );

  const linePoints: Point3D[] =
    mode === 'area' && points.length >= 2 ? [...points, points[0]] : points;

  return (
    <ViroARScene onTrackingUpdated={handleTrackingUpdated}>
      {/* Se ancla al primer plano horizontal/vertical detectado y expone
          una superficie invisible sobre la que se registran los toques. */}
      <ViroARPlane minHeight={0.2} minWidth={0.2} onAnchorFound={handleAnchorFound}>
        <ViroQuad
          width={TOUCH_SURFACE_SIZE}
          height={TOUCH_SURFACE_SIZE}
          rotation={[-90, 0, 0]}
          opacity={0}
          onClickState={handleTap}
        />
      </ViroARPlane>

      {surfaceReady &&
        points.map((p, index) => (
          <ViroSphere
            key={`point-${index}`}
            position={[p.x, p.y, p.z]}
            radius={0.012}
            materials={['markerPoint']}
          />
        ))}

      {surfaceReady && linePoints.length >= 2 && (
        <ViroPolyline
          position={[0, 0, 0]}
          points={linePoints.map((p) => [p.x, p.y, p.z] as [number, number, number])}
          thickness={0.004}
          materials={['activeLine']}
        />
      )}
    </ViroARScene>
  );
};

export default MeasureARScene;
