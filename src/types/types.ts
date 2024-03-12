import { Timestamp } from "firebase/firestore";

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Game {
  id: string; 
  name?: string;
  players: Player[];
  date: Timestamp;
}

