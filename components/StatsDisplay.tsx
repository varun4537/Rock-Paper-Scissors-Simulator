
import React from 'react';
import { RockIcon, PaperIcon, ScissorsIcon, LizardIcon, SpockIcon } from './icons';
import type { Stats, GameMode } from '../types';
import { AgentType } from '../types';
import { AGENT_COLORS_CLASSIC, AGENT_COLORS_SHELDON } from '../constants';

interface StatsDisplayProps {
  stats: Stats;
  gameMode: GameMode;
}

const StatBar: React.FC<{
    Icon: React.ElementType;
    label: string;
    count: number;
    total: number;
    color: string;
    gameMode: GameMode;
}> = ({ Icon, label, count, total, color, gameMode }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    return (
        <div>
            <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-2 font-medium">
                    <Icon className="h-5 w-5" style={{ color }} />
                    <span className={gameMode === 'classic' ? 'text-gray-300' : 'text-slate-300'}>{label}</span>
                </div>
                <div className={`font-mono ${gameMode === 'classic' ? 'text-gray-200' : 'text-slate-200'}`}>{count}</div>
            </div>
            <div className={`w-full ${gameMode === 'classic' ? 'bg-gray-700' : 'bg-slate-700'} rounded-full h-2.5`}>
                <div 
                    className="h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                ></div>
            </div>
        </div>
    );
};

const WinCounter: React.FC<{ Icon: React.ElementType; wins: number; color: string; gameMode: GameMode; }> = ({ Icon, wins, color, gameMode }) => (
    <div className={`flex flex-col items-center justify-center gap-1 ${gameMode === 'classic' ? 'bg-gray-700/50' : 'bg-black/20'} p-2 rounded-lg h-24 text-center`}>
        <Icon className="h-8 w-8 drop-shadow-md" style={{ color }}/>
        <span className="font-mono text-xl font-bold text-white mt-1">{wins}</span>
    </div>
);

const StatsDisplay: React.FC<StatsDisplayProps> = ({ stats, gameMode }) => {
  const theme = {
    panelBg: gameMode === 'classic' ? 'bg-gray-800/50' : 'bg-black/20',
    panelBorder: gameMode === 'classic' ? 'border-gray-700' : 'border-[#f0882f]/50',
    divider: gameMode === 'classic' ? 'border-gray-700' : 'border-slate-700',
  };

  const agentColors = gameMode === 'classic' ? AGENT_COLORS_CLASSIC : AGENT_COLORS_SHELDON;

  return (
    <div className={`${theme.panelBg} p-6 rounded-2xl shadow-lg border ${theme.panelBorder}`}>
        <h2 className="text-xl font-bold text-white mb-4">Live Statistics</h2>
        <div className="space-y-4">
            <StatBar Icon={RockIcon} label="Rock" count={stats.rock} total={stats.total} color={agentColors[AgentType.Rock].main} gameMode={gameMode} />
            <StatBar Icon={PaperIcon} label="Paper" count={stats.paper} total={stats.total} color={agentColors[AgentType.Paper].main} gameMode={gameMode} />
            <StatBar Icon={ScissorsIcon} label="Scissors" count={stats.scissors} total={stats.total} color={agentColors[AgentType.Scissors].main} gameMode={gameMode} />
            {gameMode === 'sheldon' && (
                <>
                    <StatBar Icon={LizardIcon} label="Lizard" count={stats.lizard} total={stats.total} color={agentColors[AgentType.Lizard].main} gameMode={gameMode} />
                    <StatBar Icon={SpockIcon} label="Spock" count={stats.spock} total={stats.total} color={agentColors[AgentType.Spock].main} gameMode={gameMode} />
                </>
            )}
        </div>
        <div className={`mt-6 pt-4 border-t ${theme.divider}`}>
            <h3 className="text-lg font-bold text-white mb-3">Battle Wins</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                <WinCounter Icon={RockIcon} wins={stats.wins.rock} color={agentColors[AgentType.Rock].main} gameMode={gameMode} />
                <WinCounter Icon={PaperIcon} wins={stats.wins.paper} color={agentColors[AgentType.Paper].main} gameMode={gameMode} />
                <WinCounter Icon={ScissorsIcon} wins={stats.wins.scissors} color={agentColors[AgentType.Scissors].main} gameMode={gameMode} />
                {gameMode === 'sheldon' && (
                    <>
                        <WinCounter Icon={LizardIcon} wins={stats.wins.lizard} color={agentColors[AgentType.Lizard].main} gameMode={gameMode} />
                        <WinCounter Icon={SpockIcon} wins={stats.wins.spock} color={agentColors[AgentType.Spock].main} gameMode={gameMode} />
                    </>
                )}
            </div>
        </div>
    </div>
  );
};

export default StatsDisplay;
