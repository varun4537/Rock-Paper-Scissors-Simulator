
import React from 'react';
import type { SimulationSettings, SettingsConfig, GameMode, SimulationState } from '../types';
import { AgentType } from '../types';
import { PlayIcon, PauseIcon, StopIcon, RestartIcon, RockIcon, PaperIcon, ScissorsIcon, LizardIcon, SpockIcon } from './icons';
import { AGENT_COLORS_CLASSIC, AGENT_COLORS_SHELDON } from '../constants';

interface ControlsProps {
  settings: SimulationSettings;
  settingsConfig: SettingsConfig;
  onSettingsChange: (newSettings: Partial<SimulationSettings>) => void;
  onRestart: () => void;
  onPlayPause: () => void;
  onStop: () => void;
  simulationState: SimulationState;
  totalPopulation: number;
  gameMode: GameMode;
  agentToAdd: AgentType | null;
  onSetAgentToAdd: (type: AgentType | null) => void;
}

const Slider: React.FC<{
  label: string;
  id: keyof SimulationSettings;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  gameMode: GameMode;
}> = ({ label, id, value, min, max, step, onChange, gameMode }) => (
    <div className="flex flex-col">
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={id} className={`text-sm font-medium ${gameMode === 'classic' ? 'text-gray-300' : 'text-slate-300'}`}>{label}</label>
            <span className={`text-sm font-mono ${gameMode === 'classic' ? 'bg-gray-700/50' : 'bg-black/20'} px-2 py-0.5 rounded`}>{value}</span>
        </div>
        <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className={`w-full h-2 ${gameMode === 'classic' ? 'bg-gray-700' : 'bg-slate-700'} rounded-lg appearance-none cursor-pointer range-lg ${gameMode === 'classic' ? 'accent-blue-500' : 'accent-[#f0882f]'}`}
        />
    </div>
);

const ControlButton: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode; className?: string; title: string; }> = ({ onClick, disabled = false, children, className = '', title }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        aria-label={title}
        className={`flex-1 flex justify-center items-center text-white py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
        {children}
    </button>
);


const Controls: React.FC<ControlsProps> = ({ settings, settingsConfig, onSettingsChange, onRestart, onPlayPause, onStop, simulationState, totalPopulation, gameMode, agentToAdd, onSetAgentToAdd }) => {

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    onSettingsChange({ [id]: parseFloat(value) });
  };
  
  const handleAgentSelect = (type: AgentType) => {
    if (simulationState === 'stopped') return;
    onSetAgentToAdd(agentToAdd === type ? null : type);
  }
  
  const theme = {
    panelBg: gameMode === 'classic' ? 'bg-gray-800/50' : 'bg-black/20',
    panelBorder: gameMode === 'classic' ? 'border-gray-700' : 'border-[#f0882f]/50',
    textMuted: gameMode === 'classic' ? 'text-gray-400' : 'text-slate-400',
    divider: gameMode === 'classic' ? 'border-gray-700' : 'border-slate-700',
  };
  
  const agentColors = gameMode === 'classic' ? AGENT_COLORS_CLASSIC : AGENT_COLORS_SHELDON;

  const agentAddButtons = [
    { type: AgentType.Rock, Icon: RockIcon },
    { type: AgentType.Paper, Icon: PaperIcon },
    { type: AgentType.Scissors, Icon: ScissorsIcon },
    ...(gameMode === 'sheldon' ? [
        { type: AgentType.Lizard, Icon: LizardIcon },
        { type: AgentType.Spock, Icon: SpockIcon },
    ] : [])
  ];

  return (
    <div className={`${theme.panelBg} p-6 rounded-2xl shadow-lg border ${theme.panelBorder}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Controls</h2>
        <span className={`text-sm font-mono ${theme.textMuted}`}>Pop: {totalPopulation}</span>
      </div>

       <div className="flex gap-2">
            <ControlButton 
              onClick={onPlayPause} 
              className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              title={simulationState === 'running' ? 'Pause' : (simulationState === 'paused' ? 'Resume' : 'Start')}
            >
                {simulationState === 'running' ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
            </ControlButton>
            <ControlButton 
              onClick={onStop} 
              disabled={simulationState === 'stopped'} 
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
              title="Stop"
            >
                <StopIcon className="h-6 w-6" />
            </ControlButton>
             <ControlButton 
              onClick={onRestart} 
              className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
              title="Restart"
             >
                <RestartIcon className="h-6 w-6" />
            </ControlButton>
       </div>
       
       <div className={`mt-6 pt-4 border-t ${theme.divider}`}>
            <h3 className={`text-lg font-bold text-white mb-3 ${simulationState === 'stopped' ? 'text-gray-500' : ''}`}>Add Agents</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {agentAddButtons.map(({ type, Icon }) => {
                    const color = agentColors[type].main;
                    const isActive = agentToAdd === type;
                    return (
                        <button 
                            key={type}
                            onClick={() => handleAgentSelect(type)}
                            disabled={simulationState === 'stopped'}
                            className={`flex items-center justify-center p-2 rounded-lg transition-all duration-200 border-2 disabled:opacity-50 disabled:cursor-not-allowed ${isActive ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
                            style={{ borderColor: isActive ? color : 'transparent' }}
                            aria-label={`Add ${AgentType[type]}`}
                            title={`Add ${AgentType[type]}`}
                        >
                            <Icon className="h-8 w-8" style={{ color }} />
                        </button>
                    )
                })}
            </div>
            {simulationState === 'stopped' && <p className="text-xs text-center mt-2 text-gray-500">Start the simulation to add agents.</p>}
       </div>
      
      <div className={`space-y-6 mt-6 pt-6 border-t ${theme.divider}`}>
        <Slider 
            label="Rock Population" 
            id="rockCount"
            value={settings.rockCount}
            min={settingsConfig.rockCount.min}
            max={settingsConfig.rockCount.max}
            step={settingsConfig.rockCount.step}
            onChange={handleSliderChange}
            gameMode={gameMode}
        />
        <Slider 
            label="Paper Population" 
            id="paperCount"
            value={settings.paperCount}
            min={settingsConfig.paperCount.min}
            max={settingsConfig.paperCount.max}
            step={settingsConfig.paperCount.step}
            onChange={handleSliderChange}
            gameMode={gameMode}
        />
        <Slider 
            label="Scissors Population" 
            id="scissorsCount"
            value={settings.scissorsCount}
            min={settingsConfig.scissorsCount.min}
            max={settingsConfig.scissorsCount.max}
            step={settingsConfig.scissorsCount.step}
            onChange={handleSliderChange}
            gameMode={gameMode}
        />
        {gameMode === 'sheldon' && (
            <>
                <Slider 
                    label="Lizard Population" 
                    id="lizardCount"
                    value={settings.lizardCount}
                    min={settingsConfig.lizardCount.min}
                    max={settingsConfig.lizardCount.max}
                    step={settingsConfig.lizardCount.step}
                    onChange={handleSliderChange}
                    gameMode={gameMode}
                />
                <Slider 
                    label="Spock Population" 
                    id="spockCount"
                    value={settings.spockCount}
                    min={settingsConfig.spockCount.min}
                    max={settingsConfig.spockCount.max}
                    step={settingsConfig.spockCount.step}
                    onChange={handleSliderChange}
                    gameMode={gameMode}
                />
            </>
        )}
        <hr className={theme.divider} />
        <Slider 
            label="Agent Speed" 
            id="speed"
            value={settings.speed}
            min={settingsConfig.speed.min}
            max={settingsConfig.speed.max}
            step={settingsConfig.speed.step}
            onChange={handleSliderChange}
            gameMode={gameMode}
        />
        <Slider 
            label="Arena Size" 
            id="arenaRadiusMultiplier"
            value={settings.arenaRadiusMultiplier}
            min={settingsConfig.arenaRadiusMultiplier.min}
            max={settingsConfig.arenaRadiusMultiplier.max}
            step={settingsConfig.arenaRadiusMultiplier.step}
            onChange={handleSliderChange}
            gameMode={gameMode}
        />
      </div>
    </div>
  );
};

export default Controls;
