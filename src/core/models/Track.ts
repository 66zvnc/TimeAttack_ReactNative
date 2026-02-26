export interface Track {
  id: string;
  name: string;
  startCenter: {
    latitude: number;
    longitude: number;
  };
  startRadius: number;
  finishCenter: {
    latitude: number;
    longitude: number;
  };
  finishRadius: number;
}
