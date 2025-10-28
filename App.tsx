
import React, { useState, useCallback, useEffect } from 'react';
import Sketch from './components/Sketch';
import Controls from './components/Controls';
import StatsDisplay from './components/StatsDisplay';
import { DEFAULT_SETTINGS, SETTINGS_CONFIG } from './constants';
import type { SimulationSettings, Stats, GameMode, SimulationState } from './types';
import { RockIcon, PaperIcon, ScissorsIcon, LizardIcon, SpockIcon, SheldonIcon } from './components/icons';

const App: React.FC = () => {
  const [settings, setSettings] = useState<SimulationSettings>(DEFAULT_SETTINGS);
  const [liveStats, setLiveStats] = useState<Stats>({ rock: 0, paper: 0, scissors: 0, lizard: 0, spock: 0, total: 0, wins: { rock: 0, paper: 0, scissors: 0, lizard: 0, spock: 0 } });
  const [simulationKey, setSimulationKey] = useState<number>(0);
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [simulationState, setSimulationState] = useState<SimulationState>('stopped');

  const handleSettingsChange = (newSettings: Partial<SimulationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  const handleRestart = useCallback(() => {
    setSimulationKey(prevKey => prevKey + 1);
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
      setSettings(prev => ({
        ...prev,
        lizardCount: 0,
        spockCount: 0,
      }));
    } else { // sheldon
       setSettings(prev => ({
        ...prev,
        rockCount: prev.rockCount || 30,
        paperCount: prev.paperCount || 30,
        scissorsCount: prev.scissorsCount || 30,
        lizardCount: 30,
        spockCount: 30,
       }));
    }
    setSimulationKey(prevKey => prevKey + 1);
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
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePlayPause]);
  
  const totalPopulation = settings.rockCount + settings.paperCount + settings.scissorsCount + settings.lizardCount + settings.spockCount;

  const RuleDisplay: React.FC<{ icon: React.ElementType; name: string; beats: { icon: React.ElementType; name: string; color: string }[]; color: string }> = ({ icon: Icon, name, beats, color }) => (
    <div className={`flex flex-col items-center gap-1 p-2 ${gameMode === 'classic' ? 'bg-gray-700/50' : 'bg-black/20'} rounded-lg`}>
      <Icon className={`h-5 w-5 ${color}`} />
      <span className={`font-semibold ${gameMode === 'classic' ? 'text-gray-300' : 'text-slate-300'}`}>{name}</span>
      <span className={`${gameMode === 'classic' ? 'text-gray-500' : 'text-slate-400'} text-xs`}>beats</span>
      <div className="flex gap-2 mt-1">
        {beats.map(b => <b.icon key={b.name} className={`h-4 w-4 ${b.color}`} title={b.name} />)}
      </div>
    </div>
  );

  // Theme colors
  const theme = {
    bg: gameMode === 'classic' ? 'bg-gray-900' : 'bg-[#013f73]',
    text: gameMode === 'classic' ? 'text-gray-200' : 'text-slate-200',
    textMuted: gameMode === 'classic' ? 'text-gray-400' : 'text-slate-400',
    panelBg: gameMode === 'classic' ? 'bg-gray-800/50' : 'bg-black/20',
    panelBorder: gameMode === 'classic' ? 'border-gray-700' : 'border-[#f0882f]/50',
    headerText: gameMode === 'classic' ? 'text-white' : 'text-[#f0882f]',
  };


  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} font-sans p-4 sm:p-6 lg:p-8 transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto relative">
        <button 
            onClick={() => handleModeChange(gameMode === 'classic' ? 'sheldon' : 'classic')} 
            className={`absolute top-0 right-0 z-10 p-1 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 ${gameMode === 'sheldon' ? 'ring-offset-[#013f73] ring-[#f0882f] border-[#f0882f]/50' : 'ring-offset-gray-900 ring-gray-600 border-gray-600/50'}`}
            aria-label="Toggle Sheldon Mode"
            title="Toggle Sheldon Mode"
        >
            <SheldonIcon className="h-12 w-12" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-16 sm:pt-4">
          
          <div className="lg:col-span-1 flex flex-col gap-8">
            <header className={`${theme.panelBg} p-6 rounded-2xl shadow-lg border ${theme.panelBorder}`}>
              <h1 className={`text-3xl font-bold ${theme.headerText} tracking-tight`}>Rock Paper Scissors Simulator</h1>
              <p className={`mt-2 ${theme.textMuted}`}>
                {gameMode === 'classic' ? 'The timeless classic.' : '...Lizard, Spock. Bazinga!'}
              </p>
              
              {gameMode === 'classic' ? (
                <div className={`flex justify-around mt-6 text-xs ${theme.textMuted}`}>
                    <div className="flex items-center gap-1">
                        <RockIcon className="h-4 w-4 text-blue-400" /> beats <ScissorsIcon className="h-4 w-4 text-red-400" />
                    </div>
                    <div className="flex items-center gap-1">
                        <ScissorsIcon className="h-4 w-4 text-red-400" /> beats <PaperIcon className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="flex items-center gap-1">
                        <PaperIcon className="h-4 w-4 text-green-400" /> beats <RockIcon className="h-4 w-4 text-blue-400" />
                    </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 mt-6">
                  <RuleDisplay icon={RockIcon} name="Rock" color="text-gray-400" beats={[{icon: ScissorsIcon, name: 'Scissors', color: 'text-[#f40234]'}, {icon: LizardIcon, name: 'Lizard', color: 'text-[#f0532c]'}]} />
                  <RuleDisplay icon={PaperIcon} name="Paper" color="text-[#688b2e]" beats={[{icon: RockIcon, name: 'Rock', color: 'text-gray-400'}, {icon: SpockIcon, name: 'Spock', color: 'text-[#f0882f]'}]} />
                  <RuleDisplay icon={ScissorsIcon} name="Scissors" color="text-[#f40234]" beats={[{icon: PaperIcon, name: 'Paper', color: 'text-[#688b2e]'}, {icon: LizardIcon, name: 'Lizard', color: 'text-[#f0532c]'}]} />
                  <RuleDisplay icon={LizardIcon} name="Lizard" color="text-[#f0532c]" beats={[{icon: SpockIcon, name: 'Spock', color: 'text-[#f0882f]'}, {icon: PaperIcon, name: 'Paper', color: 'text-[#688b2e]'}]} />
                  <RuleDisplay icon={SpockIcon} name="Spock" color="text-[#f0882f]" beats={[{icon: ScissorsIcon, name: 'Scissors', color: 'text-[#f40234]'}, {icon: RockIcon, name: 'Rock', color: 'text-gray-400'}]} />
                </div>
              )}

            </header>

            <StatsDisplay stats={liveStats} gameMode={gameMode}/>
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

          <div className={`${theme.panelBg} lg:col-span-2 rounded-2xl shadow-lg border ${theme.panelBorder} aspect-square overflow-hidden`}>
            <Sketch 
              key={simulationKey}
              settings={settings} 
              onStatsUpdate={handleStatsUpdate} 
              gameMode={gameMode}
              simulationState={simulationState}
            />
          </div>
        </div>
        <footer className={`text-center mt-8 ${gameMode === 'classic' ? 'text-gray-500' : 'text-slate-500'} text-sm`}>
          <p>Built by a world-class senior frontend engineer.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
