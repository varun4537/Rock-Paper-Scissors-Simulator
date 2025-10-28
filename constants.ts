
import type { SimulationSettings, SettingsConfig } from './types';
import { AgentType } from './types';

export const AGENT_COLORS_CLASSIC: { [key in AgentType]: { main: string; trail: string } } = {
  [AgentType.Rock]:     { main: '#60a5fa', trail: 'rgba(96, 165, 250, 0.1)' }, // blue-400
  [AgentType.Paper]:    { main: '#4ade80', trail: 'rgba(74, 222, 128, 0.1)' }, // green-400
  [AgentType.Scissors]: { main: '#f87171', trail: 'rgba(248, 113, 113, 0.1)' }, // red-400
  [AgentType.Lizard]:   { main: '#c084fc', trail: 'rgba(192, 132, 252, 0.1)' }, // purple-400
  [AgentType.Spock]:    { main: '#facc15', trail: 'rgba(250, 204, 21, 0.1)' }, // yellow-400
};

export const AGENT_COLORS_SHELDON: { [key in AgentType]: { main: string; trail: string } } = {
  [AgentType.Rock]:     { main: '#9ca3af', trail: 'rgba(156, 163, 175, 0.1)' }, // gray-400, for contrast
  [AgentType.Paper]:    { main: '#688b2e', trail: 'rgba(104, 139, 46, 0.1)' },
  [AgentType.Scissors]: { main: '#f40234', trail: 'rgba(244, 2, 52, 0.1)' },
  [AgentType.Lizard]:   { main: '#f0532c', trail: 'rgba(240, 83, 44, 0.1)' },
  [AgentType.Spock]:    { main: '#f0882f', trail: 'rgba(240, 136, 47, 0.1)' },
};


export const AGENT_RADIUS = 5;

export const DEFAULT_SETTINGS: SimulationSettings = {
  rockCount: 50,
  paperCount: 50,
  scissorsCount: 50,
  lizardCount: 0,
  spockCount: 0,
  speed: 1.5,
  arenaRadiusMultiplier: 0.9,
};

export const SETTINGS_CONFIG: SettingsConfig = {
    rockCount: { min: 0, max: 150, step: 1 },
    paperCount: { min: 0, max: 150, step: 1 },
    scissorsCount: { min: 0, max: 150, step: 1 },
    lizardCount: { min: 0, max: 150, step: 1 },
    spockCount: { min: 0, max: 150, step: 1 },
    speed: { min: 0.1, max: 5, step: 0.1 },
    arenaRadiusMultiplier: { min: 0.5, max: 1.0, step: 0.05 },
};
