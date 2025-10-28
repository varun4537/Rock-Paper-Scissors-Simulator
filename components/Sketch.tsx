import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import type { SimulationSettings, Stats, GameMode, SimulationState } from '../types';
import { AgentType } from '../types';
import { AGENT_COLORS_CLASSIC, AGENT_COLORS_SHELDON, AGENT_RADIUS } from '../constants';

interface SketchProps {
  restartKey: number;
  settings: SimulationSettings;
  onStatsUpdate: (stats: Stats) => void;
  gameMode: GameMode;
  simulationState: SimulationState;
}

const Sketch: React.FC<SketchProps> = ({ restartKey, settings, onStatsUpdate, gameMode, simulationState }) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    const sketch = (p: p5) => {
      let agents: Agent[] = [];
      let rules: Map<AgentType, AgentType[]>;
      let winCounts: { [key in keyof Stats['wins']]: number };
      
      const agentColors = gameMode === 'classic' ? AGENT_COLORS_CLASSIC : AGENT_COLORS_SHELDON;

      const initializeState = () => {
        agents = [];
        winCounts = { rock: 0, paper: 0, scissors: 0, lizard: 0, spock: 0 };
        
        let idCounter = 0;
        for (let i = 0; i < settings.rockCount; i++) agents.push(new Agent(idCounter++, AgentType.Rock));
        for (let i = 0; i < settings.paperCount; i++) agents.push(new Agent(idCounter++, AgentType.Paper));
        for (let i = 0; i < settings.scissorsCount; i++) agents.push(new Agent(idCounter++, AgentType.Scissors));
        if (gameMode === 'sheldon') {
          for (let i = 0; i < settings.lizardCount; i++) agents.push(new Agent(idCounter++, AgentType.Lizard));
          for (let i = 0; i < settings.spockCount; i++) agents.push(new Agent(idCounter++, AgentType.Spock));
        }

        // Only draw the initial state, don't start the loop until play is pressed.
        if (p5InstanceRef.current) {
          p.redraw();
        }
      };

      if (gameMode === 'classic') {
          rules = new Map<AgentType, AgentType[]>([
            [AgentType.Rock, [AgentType.Scissors]],
            [AgentType.Paper, [AgentType.Rock]],
            [AgentType.Scissors, [AgentType.Paper]]
          ]);
      } else { // sheldon
          rules = new Map<AgentType, AgentType[]>([
            [AgentType.Rock, [AgentType.Scissors, AgentType.Lizard]],
            [AgentType.Paper, [AgentType.Rock, AgentType.Spock]],
            [AgentType.Scissors, [AgentType.Paper, AgentType.Lizard]],
            [AgentType.Lizard, [AgentType.Spock, AgentType.Paper]],
            [AgentType.Spock, [AgentType.Scissors, AgentType.Rock]]
          ]);
      }
      
      const incrementWin = (type: AgentType) => {
        if (type === AgentType.Rock) winCounts.rock++;
        else if (type === AgentType.Paper) winCounts.paper++;
        else if (type === AgentType.Scissors) winCounts.scissors++;
        else if (type === AgentType.Lizard) winCounts.lizard++;
        else if (type === AgentType.Spock) winCounts.spock++;
      };

      class Agent {
        id: number;
        type: AgentType;
        pos: p5.Vector;
        vel: p5.Vector;
        radius: number;
        color: { main: string; trail: string };

        constructor(id: number, type: AgentType) {
          this.id = id;
          this.type = type;
          this.radius = AGENT_RADIUS;
          this.color = agentColors[this.type];
          
          const angle = p.random(p.TWO_PI);
          const r = p.random((p.width / 2) * settings.arenaRadiusMultiplier - this.radius);
          this.pos = p.createVector(
              p.width / 2 + r * Math.cos(angle), 
              p.height / 2 + r * Math.sin(angle)
          );
          
          this.vel = p5.Vector.random2D().mult(settings.speed);
        }

        updateType(newType: AgentType) {
            this.type = newType;
            this.color = agentColors[this.type];
        }

        update() {
          this.pos.add(this.vel);
          this.handleWallCollision();
        }

        handleWallCollision() {
          const center = p.createVector(p.width / 2, p.height / 2);
          const distFromCenter = this.pos.dist(center);
          const arenaRadius = (p.width / 2) * settings.arenaRadiusMultiplier;

          if (distFromCenter > arenaRadius - this.radius) {
            const toCenter = p5.Vector.sub(center, this.pos).normalize();
            this.pos = p5.Vector.sub(center, toCenter.mult(arenaRadius - this.radius));

            const normal = p5.Vector.sub(this.pos, center).normalize();
            this.vel.reflect(normal);
          }
        }
        
        checkCollision(other: Agent) {
            const distance = this.pos.dist(other.pos);
            if (distance < this.radius + other.radius) {
                this.resolveCollision(other);
            }
        }

        resolveCollision(other: Agent) {
            const thisBeatsOther = rules.get(this.type)?.includes(other.type);
            const otherBeatsThis = rules.get(other.type)?.includes(this.type);

            if (thisBeatsOther && !otherBeatsThis) {
                incrementWin(this.type);
                other.updateType(this.type);
            } else if (otherBeatsThis && !thisBeatsOther) {
                incrementWin(other.type);
                this.updateType(other.type);
            }

            const normal = p5.Vector.sub(other.pos, this.pos).normalize();
            const tangent = p.createVector(-normal.y, normal.x);
            
            const v1n = normal.dot(this.vel);
            const v1t = tangent.dot(this.vel);
            const v2n = normal.dot(other.vel);
            const v2t = tangent.dot(other.vel);
            
            const v1n_new = v2n;
            const v2n_new = v1n;

            this.vel = p5.Vector.add(normal.copy().mult(v1n_new), tangent.copy().mult(v1t));
            other.vel = p5.Vector.add(normal.copy().mult(v2n_new), tangent.copy().mult(v2t));
        }

        display() {
          p.noStroke();
          p.fill(this.color.main);
          p.circle(this.pos.x, this.pos.y, this.radius * 2);
        }
      }

      p.setup = () => {
        const parent = sketchRef.current;
        if (!parent) return;
        
        const size = Math.min(parent.clientWidth, parent.clientHeight);
        p.createCanvas(size, size).parent(parent);
        initializeState();
        p.noLoop(); // Don't start drawing immediately
      };
      
      p.windowResized = () => {
        const parent = sketchRef.current;
        if (!parent) return;
        const size = Math.min(parent.clientWidth, parent.clientHeight);
        p.resizeCanvas(size, size);
      };

      p.draw = () => {
        if (gameMode === 'classic') {
          p.background(17, 24, 39); // gray-900
        } else {
          p.background(1, 63, 115); // #013f73
        }

        const arenaRadius = (p.width / 2) * settings.arenaRadiusMultiplier;
        p.noFill();
        p.strokeWeight(4);

        if (gameMode === 'classic') {
          p.stroke(49, 61, 85, 100);
        } else {
          p.stroke(240, 136, 47, 50); // #f0882f with opacity
        }
        
        p.circle(p.width/2, p.height/2, arenaRadius * 2);
        p.strokeWeight(1);
        
        if (gameMode === 'classic') {
          p.stroke(59, 73, 101);
        } else {
          p.stroke(240, 136, 47); // #f0882f
        }
        p.circle(p.width/2, p.height/2, arenaRadius * 2);

        if (simulationState === 'running') {
            agents.forEach(agent => {
              agent.update();
            });
            
            for (let i = 0; i < agents.length; i++) {
                for (let j = i + 1; j < agents.length; j++) {
                    agents[i].checkCollision(agents[j]);
                }
            }
        }
        
        agents.forEach(agent => {
          agent.display();
        });

        if (p.frameCount % 5 === 0) {
            const stats: Stats = agents.reduce((acc, agent) => {
                if (agent.type === AgentType.Rock) acc.rock++;
                if (agent.type === AgentType.Paper) acc.paper++;
                if (agent.type === AgentType.Scissors) acc.scissors++;
                if (agent.type === AgentType.Lizard) acc.lizard++;
                if (agent.type === AgentType.Spock) acc.spock++;
                return acc;
            }, { rock: 0, paper: 0, scissors: 0, lizard: 0, spock: 0, total: agents.length, wins: { ...winCounts } });
            onStatsUpdate(stats);
        }
      };
    };
    
    if (sketchRef.current) {
        if (p5InstanceRef.current) {
            p5InstanceRef.current.remove();
        }
        p5InstanceRef.current = new p5(sketch);
    }
    
    return () => {
      p5InstanceRef.current?.remove();
      p5InstanceRef.current = null;
    };
// Re-added restartKey to trigger resets
  }, [restartKey, settings, onStatsUpdate, gameMode]);
  
  useEffect(() => {
    const p5Instance = p5InstanceRef.current;
    if (!p5Instance) return;

    if (simulationState === 'running') {
        p5Instance.loop();
    } else if (simulationState === 'paused' || simulationState === 'stopped') {
        p5Instance.noLoop();
        // Redraw once to show the current state when paused or stopped
        p5Instance.redraw();
    }
  }, [simulationState]);


  return <div ref={sketchRef} className="w-full h-full cursor-pointer" />;
};

export default Sketch;
