import { RunPoint } from './RunPoint';

export interface Run {
  id: string;
  trackId: string;
  startDate: number;
  endDate?: number;
  duration?: number;
  points: RunPoint[];
}
