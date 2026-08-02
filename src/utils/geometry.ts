export type Point3D = { x: number; y: number; z: number };

export function distance3D(a: Point3D, b: Point3D): number {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2 + (b.z - a.z) ** 2);
}

// Área de un polígono plano en el espacio 3D (fórmula de Newell).
// Asume que los puntos son coplanares, lo cual se cumple si todos
// se tocaron sobre la misma superficie AR detectada.
export function polygonArea3D(points: Point3D[]): number {
  if (points.length < 3) return 0;

  const normal = { x: 0, y: 0, z: 0 };
  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    normal.x += (current.y - next.y) * (current.z + next.z);
    normal.y += (current.z - next.z) * (current.x + next.x);
    normal.z += (current.x - next.x) * (current.y + next.y);
  }

  return Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2) / 2;
}

export function formatLength(meters: number): string {
  if (meters < 1) return `${Math.round(meters * 100)} cm`;
  return `${meters.toFixed(2)} m`;
}

export function formatArea(squareMeters: number): string {
  if (squareMeters < 1) return `${Math.round(squareMeters * 10000)} cm²`;
  return `${squareMeters.toFixed(2)} m²`;
}
