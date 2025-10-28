import React from 'react';
import type { SimulationSettings, SettingsConfig, GameMode, SimulationState } from '../types';
import { PlayIcon, PauseIcon, StopIcon, RestartIcon } from './icons';

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

const ControlButton: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode; className?: string; }> = ({ onClick, disabled = false, children, className = '' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex-1 flex justify-center items-center gap-2 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
        {children}
    </button>
);


const Controls: React.FC<ControlsProps> = ({ settings, settingsConfig, onSettingsChange, onRestart, onPlayPause, onStop, simulationState, totalPopulation, gameMode }) => {

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    onSettingsChange({ [id]: parseFloat(value) });
  };
  
  const getPlayPauseContent = () => {
    if (simulationState === 'running') return <><PauseIcon className="h-5 w-5" /> Pause</>;
    if (simulationState === 'paused') return <><PlayIcon className="h-5 w-5" /> Resume</>;
    return <><PlayIcon className="h-5 w-5" /> Start</>;
  };
  
  const theme = {
    panelBg: gameMode === 'classic' ? 'bg-gray-800/50' : 'bg-black/20',
    panelBorder: gameMode === 'classic' ? 'border-gray-700' : 'border-[#f0882f]/50',
    textMuted: gameMode === 'classic' ? 'text-gray-400' : 'text-slate-400',
    divider: gameMode === 'classic' ? 'border-gray-700' : 'border-slate-700',
  };

  return (
    <div className={`${theme.panelBg} p-6 rounded-2xl shadow-lg border ${theme.panelBorder}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Controls</h2>
        <span className={`text-sm font-mono ${theme.textMuted}`}>Pop: {totalPopulation}</span>
      </div>

       <div className="flex gap-2">
            <ControlButton onClick={onPlayPause} className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500">
                {getPlayPauseContent()}
            </ControlButton>
            <ControlButton onClick={onStop} disabled={simulationState === 'stopped'} className="bg-red-600 hover:bg-red-700 focus:ring-red-500">
                <StopIcon className="h-5 w-5" /> Stop
            </ControlButton>
             <ControlButton onClick={onRestart} className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500">
                <RestartIcon className="h-5 w-5" /> Restart
            </ControlButton>
       </div>
      
<div className={`mt-6 grid gap-4 ${gameMode === 'sheldon' ? 'grid-cols-2' : 'grid-cols-1'}`}>
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
            // Fix: Corrected typo in function name from `handleSliderchange` to `handleSliderChange`.
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
        <hr className={`${theme.divider} col-span-full`} />
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
