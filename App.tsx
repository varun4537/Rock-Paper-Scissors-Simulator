import React, { useState, useCallback, useEffect } from 'react';
import Sketch from './components/Sketch';
import Controls from './components/Controls';
import StatsDisplay from './components/StatsDisplay';
import { DEFAULT_SETTINGS, SETTINGS_CONFIG } from './constants';
import type { SimulationSettings, Stats, GameMode, SimulationState } from './types';
import {
  RockIcon,
  PaperIcon,
  ScissorsIcon,
  LizardIcon,
  SpockIcon,
  SheldonIcon,
} from './components/icons';

const App: React.FC = () => {
  const [settings, setSettings] = useState<SimulationSettings>(DEFAULT_SETTINGS);
  const [liveStats, setLiveStats] = useState<Stats>({
    rock: 0,
    paper: 0,
    scissors: 0,
    lizard: 0,
    spock: 0,
    total: 0,
    wins: { rock: 0, paper: 0, scissors: 0, lizard: 0, spock: 0 },
  });
  const [simulationKey, setSimulationKey] = useState<number>(0);
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [simulationState, setSimulationState] = useState<SimulationState>('stopped');

  const isSheldon = gameMode === 'sheldon';

  const theme = isSheldon
    ? {
        background: 'bg-[#013f73]',
        text: 'text-slate-100',
        muted: 'text-slate-100/80',
        surface: 'bg-white/10 backdrop-blur-sm',
        surfaceBorder: 'border-[#f0a65e]/45',
        headerAccent: 'text-white',
        ruleSurface: 'bg-white/10 border-white/20',
        ruleMuted: 'text-slate-100/70',
        toggleBg: 'bg-[#013f73]/40 hover:bg-[#f0882f]/20',
        toggleBorder: 'border-[#f0882f]/60',
        toggleRing: 'ring-offset-[#013f73] ring-[#f0882f]',
      }
    : {
        background: 'bg-slate-950',
        text: 'text-slate-100',
        muted: 'text-slate-400',
        surface: 'bg-slate-900/80 backdrop-blur',
        surfaceBorder: 'border-slate-800/80',
        headerAccent: 'text-white',
        ruleSurface: 'bg-slate-900/70 border-white/5',
        ruleMuted: 'text-slate-400',
        toggleBg: 'bg-slate-900/60 hover:bg-slate-800/60',
        toggleBorder: 'border-slate-700/70',
        toggleRing: 'ring-offset-slate-950 ring-slate-600',
      };

  const handleSettingsChange = (newSettings: Partial<SimulationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleRestart = useCallback(() => {
    setSimulationKey((prevKey) => prevKey + 1);
    setSimulationState('running');
  }, []);

  const handlePlayPause = useCallback(() => {
    if (simulationState === 'running') {
      setSimulationState('paused');
    } else if (simulationState === 'paused') {
      setSimulationState('running');
    } else if (simulationState === 'stopped') {
      handleRestart();
    }
  }, [simulationState, handleRestart]);

  const handleStop = () => {
    if (simulationState !== 'stopped') {
      setSimulationState('stopped');
    }
  };

  const handleStatsUpdate = useCallback((newStats: Stats) => {
    setLiveStats(newStats);
  }, []);

  const handleModeChange = (newMode: GameMode) => {
    if (newMode === gameMode) return;

    setGameMode(newMode);
    if (newMode === 'classic') {
      setSettings((prev) => ({
        ...prev,
        lizardCount: 0,
        spockCount: 0,
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        rockCount: prev.rockCount ?? 30,
        paperCount: prev.paperCount ?? 30,
        scissorsCount: prev.scissorsCount ?? 30,
        lizardCount: 30,
        spockCount: 30,
      }));
    }
    setSimulationKey((prevKey) => prevKey + 1);
    setSimulationState('stopped');
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        handlePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause]);

  const totalPopulation =
    settings.rockCount +
    settings.paperCount +
    settings.scissorsCount +
    settings.lizardCount +
    settings.spockCount;

  const RuleDisplay: React.FC<{
    icon: React.ElementType;
    name: string;
    beats: { icon: React.ElementType; name: string; color: string }[];
    color: string;
  }> = ({ icon: Icon, name, beats, color }) => (
    <div
      className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center shadow-sm ${theme.ruleSurface}`}
    >
      <Icon className={`h-6 w-6 ${color}`} />
      <span className="text-sm font-semibold">{name}</span>
      <span className={`text-[11px] uppercase tracking-wide ${theme.ruleMuted}`}>beats</span>
      <div className="flex items-center justify-center gap-2">
        {beats.map((item) => (
          <item.icon key={item.name} className={`h-4 w-4 ${item.color}`} title={item.name} />
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.background} ${theme.text} font-sans transition-colors duration-500`}>
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={() => handleModeChange(isSheldon ? 'classic' : 'sheldon')}
          aria-label="Toggle Sheldon Mode"
          title="Toggle Sheldon Mode"
          className={`absolute right-6 top-6 z-20 flex h-16 w-16 items-center justify-center rounded-full border-2 shadow-xl transition-all duration-300 focus:outline-none focus-visible:ring-4 ${theme.toggleBg} ${theme.toggleBorder} ring-2 ${theme.toggleRing}`}
        >
          <SheldonIcon />
        </button>

        <div className="grid gap-8 lg:grid-cols-[320px,minmax(0,1fr)] xl:grid-cols-[360px,minmax(0,1fr)]">
          <div className="flex flex-col gap-6 lg:gap-8">
            <header
              className={`${theme.surface} border ${theme.surfaceBorder} rounded-3xl p-6 shadow-xl lg:p-7`}
            >
              <div className="space-y-3">
                <h1 className={`text-3xl font-bold leading-tight ${theme.headerAccent}`}>
                  Rock Paper Scissors Simulator
                </h1>
                <p className={`text-base ${theme.muted}`}>
                  {isSheldon ? '...Lizard, Spock. Bazinga!' : 'The timeless classic.'}
                </p>
              </div>

              {isSheldon ? (
                <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                  <RuleDisplay
                    icon={RockIcon}
                    name="Rock"
                    color="text-gray-300"
                    beats={[
                      { icon: ScissorsIcon, name: 'Scissors', color: 'text-[#f40234]' },
                      { icon: LizardIcon, name: 'Lizard', color: 'text-[#f0532c]' },
                    ]}
                  />
                  <RuleDisplay
                    icon={PaperIcon}
                    name="Paper"
                    color="text-[#8bc34a]"
                    beats={[
                      { icon: RockIcon, name: 'Rock', color: 'text-gray-300' },
                      { icon: SpockIcon, name: 'Spock', color: 'text-[#f0882f]' },
                    ]}
                  />
                  <RuleDisplay
                    icon={ScissorsIcon}
                    name="Scissors"
                    color="text-[#f40234]"
                    beats={[
                      { icon: PaperIcon, name: 'Paper', color: 'text-[#8bc34a]' },
                      { icon: LizardIcon, name: 'Lizard', color: 'text-[#f0532c]' },
                    ]}
                  />
                  <RuleDisplay
                    icon={LizardIcon}
                    name="Lizard"
                    color="text-[#f0532c]"
                    beats={[
                      { icon: SpockIcon, name: 'Spock', color: 'text-[#f0882f]' },
                      { icon: PaperIcon, name: 'Paper', color: 'text-[#8bc34a]' },
                    ]}
                  />
                  <RuleDisplay
                    icon={SpockIcon}
                    name="Spock"
                    color="text-[#f0882f]"
                    beats={[
                      { icon: ScissorsIcon, name: 'Scissors', color: 'text-[#f40234]' },
                      { icon: RockIcon, name: 'Rock', color: 'text-gray-300' },
                    ]}
                  />
                </div>
              ) : (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <RockIcon className="h-4 w-4 text-blue-400" />
                    <span className={theme.muted}>beats</span>
                    <ScissorsIcon className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <ScissorsIcon className="h-4 w-4 text-red-400" />
                    <span className={theme.muted}>beats</span>
                    <PaperIcon className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <PaperIcon className="h-4 w-4 text-green-400" />
                    <span className={theme.muted}>beats</span>
                    <RockIcon className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
              )}
            </header>

            <StatsDisplay stats={liveStats} gameMode={gameMode} />

            <Controls
              settings={settings}
              settingsConfig={SETTINGS_CONFIG}
              onSettingsChange={handleSettingsChange}
              onRestart={handleRestart}
              onPlayPause={handlePlayPause}
              onStop={handleStop}
              simulationState={simulationState}
              totalPopulation={totalPopulation}
              gameMode={gameMode}
            />
          </div>

          <div
            className={`${theme.surface} border ${theme.surfaceBorder} rounded-3xl p-4 shadow-xl sm:p-6 lg:p-8`}
          >
            <div className="relative aspect-square">
              <Sketch
                key={simulationKey}
                restartKey={simulationKey}
                settings={settings}
                onStatsUpdate={handleStatsUpdate}
                gameMode={gameMode}
                simulationState={simulationState}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
