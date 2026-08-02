import { Point3D } from './geometry';

export type MeasurementMode = 'distance' | 'area';

export type Measurement = {
  id: string;
  mode: MeasurementMode;
  value: number; // metros si es distancia, metros cuadrados si es área
  points: Point3D[];
  createdAt: string;
};
