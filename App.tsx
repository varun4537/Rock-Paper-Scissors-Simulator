
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Sketch from './components/Sketch';
import Controls from './components/Controls';
import StatsDisplay from './components/StatsDisplay';
import { DEFAULT_SETTINGS, SETTINGS_CONFIG } from './constants';
import { AGENT_COLORS_CLASSIC, AGENT_COLORS_SHELDON } from './constants';
import type { SimulationSettings, Stats, GameMode, SimulationState } from './types';
import { AgentType } from './types';
import { RockIcon, PaperIcon, ScissorsIcon, LizardIcon, SpockIcon, SheldonIcon } from './components/icons';

const App: React.FC = () => {
  const [settings, setSettings] = useState<SimulationSettings>(DEFAULT_SETTINGS);
  const [liveStats, setLiveStats] = useState<Stats>({ rock: 0, paper: 0, scissors: 0, lizard: 0, spock: 0, total: 0, wins: { rock: 0, paper: 0, scissors: 0, lizard: 0, spock: 0 } });
  const [simulationKey, setSimulationKey] = useState<number>(0);
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [simulationState, setSimulationState] = useState<SimulationState>('stopped');
  const [winner, setWinner] = useState<AgentType | null>(null);

  const simulationStateRef = useRef(simulationState);
  useEffect(() => {
    simulationStateRef.current = simulationState;
  }, [simulationState]);

  const handleSettingsChange = (newSettings: Partial<SimulationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  const handleRestart = useCallback(() => {
    setWinner(null);
    setSimulationKey(prevKey => prevKey + 1);
    setSimulationState('running');
  }, []);

  const handlePlayPause = useCallback(() => {
    if (winner) return; // Don't allow play/pause when a winner is declared
    if (simulationState === 'running') {
      setSimulationState('paused');
    } else if (simulationState === 'paused') {
      setSimulationState('running');
    } else if (simulationState === 'stopped') {
      handleRestart();
    }
  }, [simulationState, handleRestart, winner]);

  const handleStop = () => {
    if (simulationState !== 'stopped') {
      setSimulationState('stopped');
      setWinner(null);
    }
  };
  
  const handleStatsUpdate = useCallback((newStats: Stats) => {
    setLiveStats(newStats);

    if (simulationStateRef.current === 'running' && newStats.total > 1) {
        const agentCounts = {
            rock: newStats.rock,
            paper: newStats.paper,
            scissors: newStats.scissors,
            lizard: newStats.lizard,
            spock: newStats.spock,
        };

        for (const [key, count] of Object.entries(agentCounts)) {
            if (count === newStats.total) {
                const agentTypeMap: { [key: string]: AgentType } = {
                    rock: AgentType.Rock,
                    paper: AgentType.Paper,
                    scissors: AgentType.Scissors,
                    lizard: AgentType.Lizard,
                    spock: AgentType.Spock,
                };
                setWinner(agentTypeMap[key]);
                setSimulationState('stopped');
                return; 
            }
        }
    }
  }, []);

  const handleModeChange = (newMode: GameMode) => {
    if (newMode === gameMode) return;
    setWinner(null);
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

  // Theme colors
  const theme = {
    text: gameMode === 'classic' ? 'text-gray-200' : 'text-slate-200',
    textMuted: gameMode === 'classic' ? 'text-gray-400' : 'text-slate-400',
    panelBg: gameMode === 'classic' ? 'bg-gray-800/50' : 'bg-black/20',
    panelBorder: gameMode === 'classic' ? 'border-gray-700' : 'border-[#f0882f]/50',
    headerText: gameMode === 'classic' ? 'text-white' : 'text-[#f0882f]',
  };
  
  const bgClass = gameMode === 'classic' ? 'bg-gray-900' : 'bg-slate-900';

  const WinnerModal: React.FC<{ winner: AgentType | null, onRestart: () => void, gameMode: GameMode }> = ({ winner, onRestart, gameMode }) => {
    if (winner === null) return null;

    const agentColors = gameMode === 'classic' ? AGENT_COLORS_CLASSIC : AGENT_COLORS_SHELDON;
    const agentDetails: { [key in AgentType]: { name: string, Icon: React.ElementType, color: string } } = {
        [AgentType.Rock]: { name: 'Rock', Icon: RockIcon, color: agentColors[AgentType.Rock].main },
        [AgentType.Paper]: { name: 'Paper', Icon: PaperIcon, color: agentColors[AgentType.Paper].main },
        [AgentType.Scissors]: { name: 'Scissors', Icon: ScissorsIcon, color: agentColors[AgentType.Scissors].main },
        [AgentType.Lizard]: { name: 'Lizard', Icon: LizardIcon, color: agentColors[AgentType.Lizard].main },
        [AgentType.Spock]: { name: 'Spock', Icon: SpockIcon, color: agentColors[AgentType.Spock].main },
    };
    const details = agentDetails[winner];

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-opacity duration-300 animate-fade-in">
        <div className={`${theme.panelBg} p-8 rounded-2xl shadow-lg border ${theme.panelBorder} text-center max-w-sm w-full transform transition-all animate-pop-in`}>
          <h2 className={`text-4xl font-bold ${theme.headerText} tracking-tight mb-4`}>We have a winner!</h2>
          <div className="flex flex-col items-center gap-4 my-8">
            <details.Icon className="h-24 w-24 drop-shadow-lg" style={{ color: details.color }} />
            <p className="text-3xl font-bold" style={{ color: details.color }}>{details.name} wins!</p>
          </div>
          <button
            onClick={onRestart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  };

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

  const Rules = () => (
    <section className={`mt-8 ${theme.panelBg} p-6 rounded-2xl shadow-lg border ${theme.panelBorder}`}>
      <h2 className="text-xl font-bold text-white text-center mb-4">Rules</h2>
       {gameMode === 'classic' ? (
          <div className={`flex flex-wrap justify-center gap-4 text-sm ${theme.textMuted}`}>
              <div className="flex items-center gap-1.5">
                  <RockIcon className="h-5 w-5 text-blue-400" /> beats <ScissorsIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="flex items-center gap-1.5">
                  <ScissorsIcon className="h-5 w-5 text-red-400" /> beats <PaperIcon className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex items-center gap-1.5">
                  <PaperIcon className="h-5 w-5 text-green-400" /> beats <RockIcon className="h-5 w-5 text-blue-400" />
              </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <RuleDisplay icon={RockIcon} name="Rock" color="text-gray-400" beats={[{icon: ScissorsIcon, name: 'Scissors', color: 'text-[#f40234]'}, {icon: LizardIcon, name: 'Lizard', color: 'text-[#f0532c]'}]} />
            <RuleDisplay icon={PaperIcon} name="Paper" color="text-[#688b2e]" beats={[{icon: RockIcon, name: 'Rock', color: 'text-gray-400'}, {icon: SpockIcon, name: 'Spock', color: 'text-[#f0882f]'}]} />
            <RuleDisplay icon={ScissorsIcon} name="Scissors" color="text-[#f40234]" beats={[{icon: PaperIcon, name: 'Paper', color: 'text-[#688b2e]'}, {icon: LizardIcon, name: 'Lizard', color: 'text-[#f0532c]'}]} />
            <RuleDisplay icon={LizardIcon} name="Lizard" color="text-[#f0532c]" beats={[{icon: SpockIcon, name: 'Spock', color: 'text-[#f0882f]'}, {icon: PaperIcon, name: 'Paper', color: 'text-[#688b2e]'}]} />
            <RuleDisplay icon={SpockIcon} name="Spock" color="text-[#f0882f]" beats={[{icon: ScissorsIcon, name: 'Scissors', color: 'text-[#f40234]'}, {icon: RockIcon, name: 'Rock', color: 'text-gray-400'}]} />
          </div>
        )}
    </section>
  )


  return (
    <div className={`min-h-screen ${bgClass} ${theme.text} font-sans p-4 sm:p-6 lg:p-8 transition-colors duration-500`}>
      <WinnerModal winner={winner} onRestart={handleRestart} gameMode={gameMode}/>
      <div className="max-w-screen-xl mx-auto relative">
        <header className="text-center relative mb-8">
            <h1 className={`text-4xl sm:text-5xl font-bold ${theme.headerText} tracking-tight`}>
              {gameMode === 'classic' 
                ? 'Rock Paper Scissors'
                : 'Rock Paper Scissors Lizard Spock'}
            </h1>
            <p className={`mt-2 text-lg ${theme.textMuted}`}>
              {gameMode === 'classic' 
                ? 'An agent-based simulation.'
                : 'Bazinga!'}
            </p>
            <button 
                onClick={() => handleModeChange(gameMode === 'classic' ? 'sheldon' : 'classic')} 
                className={`absolute top-0 right-0 z-10 p-1 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 ${gameMode === 'sheldon' ? 'ring-offset-[#013f73] ring-[#f0882f] border-[#f0882f]/50' : 'ring-offset-gray-900 ring-gray-600 border-gray-600/50'}`}
                aria-label="Toggle Sheldon Mode"
                title="Toggle Sheldon Mode"
            >
                <SheldonIcon className="h-12 w-12" />
            </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            <aside className="lg:col-span-1">
                 <StatsDisplay stats={liveStats} gameMode={gameMode}/>
            </aside>

            <div className={`${theme.panelBg} lg:col-span-2 rounded-2xl shadow-lg border ${theme.panelBorder} aspect-square overflow-hidden`}>
              <Sketch 
                key={simulationKey}
                settings={settings} 
                onStatsUpdate={handleStatsUpdate} 
                gameMode={gameMode}
                simulationState={simulationState}
              />
            </div>
            
            <aside className="lg:col-span-1">
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
            </aside>
        </main>
        
        <Rules />

        <footer className={`text-center mt-8 ${gameMode === 'classic' ? 'text-gray-500' : 'text-slate-500'} text-sm`}>
          <p>Built by a world-class senior frontend engineer.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;