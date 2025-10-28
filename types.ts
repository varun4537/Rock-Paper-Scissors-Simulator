
export enum AgentType {
  Rock,
  Paper,
  Scissors,
  Lizard,
  Spock,
}

export type GameMode = 'classic' | 'sheldon';
export type SimulationState = 'running' | 'paused' | 'stopped';

export interface Stats {
  rock: number;
  paper: number;
  scissors: number;
  lizard: number;
  spock: number;
  total: number;
  wins: {
    rock: number;
    paper: number;
    scissors: number;
    lizard: number;
    spock: number;
  };
}

export interface SimulationSettings {
  rockCount: number;
  paperCount: number;
  scissorsCount: number;
  lizardCount: number;
  spockCount: number;
  speed: number;
  arenaRadiusMultiplier: number;
}

export interface SettingsConfig {
  rockCount: { min: number; max: number; step: number };
  paperCount: { min: number; max: number; step: number };
  scissorsCount: { min: number; max: number; step: number };
  lizardCount: { min: number; max: number; step: number };
  spockCount: { min: number; max: number; step: number };
  speed: { min: number; max: number; step: number };
  arenaRadiusMultiplier: { min: number; max: number; step: number };
}
