
import React, { useRef, useEffect } from 'react';
import type p5 from 'p5';
import type { SimulationSettings, Stats, GameMode, SimulationState } from '../types';
import { AgentType } from '../types';
import { AGENT_COLORS_CLASSIC, AGENT_COLORS_SHELDON, AGENT_RADIUS } from '../constants';

interface SketchProps {
  settings: SimulationSettings;
  onStatsUpdate: (stats: Stats) => void;
  gameMode: GameMode;
  simulationState: SimulationState;
  agentToAdd: AgentType | null;
}

const Sketch: React.FC<SketchProps> = ({ settings, onStatsUpdate, gameMode, simulationState, agentToAdd }) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const simulationStateRef = useRef(simulationState);
  const agentToAddRef = useRef(agentToAdd);

  useEffect(() => {
    simulationStateRef.current = simulationState;
  }, [simulationState]);
  
  useEffect(() => {
    agentToAddRef.current = agentToAdd;
  }, [agentToAdd]);

  useEffect(() => {
    const sketch = (p: p5) => {
      let agents: Agent[] = [];
      let effects: CollisionEffect[] = [];
      let rules: Map<AgentType, AgentType[]>;
      let winCounts: { [key in keyof Stats['wins']]: number };
      let nextAgentId = 0;
      
      const agentColors = gameMode === 'classic' ? AGENT_COLORS_CLASSIC : AGENT_COLORS_SHELDON;

      const initializeState = () => {
        agents = [];
        effects = [];
        winCounts = { rock: 0, paper: 0, scissors: 0, lizard: 0, spock: 0 };
        
        nextAgentId = 0;
        const createAgents = (count: number, type: AgentType) => {
          for (let i = 0; i < count; i++) {
            agents.push(new Agent(nextAgentId++, type, true));
          }
        };

        createAgents(settings.rockCount, AgentType.Rock);
        createAgents(settings.paperCount, AgentType.Paper);
        createAgents(settings.scissorsCount, AgentType.Scissors);
        if (gameMode === 'sheldon') {
          createAgents(settings.lizardCount, AgentType.Lizard);
          createAgents(settings.spockCount, AgentType.Spock);
        }

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
      
      class CollisionEffect {
        pos: p5.Vector;
        color: string;
        radius: number;
        maxRadius: number;
        lifespan: number;

        constructor(pos: p5.Vector, color: string) {
          this.pos = pos;
          this.color = color;
          this.radius = 0;
          this.maxRadius = 20;
          this.lifespan = 255;
        }

        update() {
          this.radius += 1;
          this.lifespan -= 15;
        }
        
        isFinished() {
          return this.lifespan <= 0;
        }

        display() {
          const c = p.color(this.color);
          c.setAlpha(this.lifespan);
          p.noFill();
          p.strokeWeight(2);
          p.stroke(c);
          p.circle(this.pos.x, this.pos.y, this.radius * 2);
        }
      }


      class Agent {
        id: number;
        type: AgentType;
        pos: p5.Vector;
        vel: p5.Vector;
        radius: number;
        color: { main: string; trail: string };

        constructor(id: number, type: AgentType, isInitial: boolean = false, position?: p5.Vector) {
          this.id = id;
          this.type = type;
          this.radius = AGENT_RADIUS;
          this.color = agentColors[this.type];
          
          if (position) {
            this.pos = position.copy();
          } else if (isInitial) {
             const angle = p.random(p.TWO_PI);
             const r = p.random((p.width / 2) * settings.arenaRadiusMultiplier - this.radius);
             this.pos = p.createVector(
                 p.width / 2 + r * Math.cos(angle), 
                 p.height / 2 + r * Math.sin(angle)
             );
          } else {
            this.pos = p.createVector(p.width/2, p.height/2);
          }
          
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
            
            let conversion = false;
            
            if (thisBeatsOther && !otherBeatsThis) {
                incrementWin(this.type);
                other.updateType(this.type);
                conversion = true;
            } else if (otherBeatsThis && !thisBeatsOther) {
                incrementWin(other.type);
                this.updateType(other.type);
                conversion = true;
            }

            if (conversion) {
                 const effectPos = p5.Vector.add(this.pos, other.pos).div(2);
                 const winnerColor = thisBeatsOther ? this.color.main : other.color.main;
                 effects.push(new CollisionEffect(effectPos, winnerColor));
            }
            
            // Positional Correction: Prevent agents from sticking together
            const distance = this.pos.dist(other.pos);
            const overlap = (this.radius + other.radius) - distance;
            if (overlap > 0) {
              const correction = p5.Vector.sub(this.pos, other.pos).normalize().mult(overlap / 2);
              this.pos.add(correction);
              other.pos.sub(correction);
            }

            // Dynamic Collision (Bounce)
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

        if (simulationStateRef.current === 'running') {
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

        // Update and display effects
        for (let i = effects.length - 1; i >= 0; i--) {
            effects[i].update();
            effects[i].display();
            if (effects[i].isFinished()) {
                effects.splice(i, 1);
            }
        }

        if (p.frameCount % 5 === 0) {
            const stats: Stats = agents.reduce((acc, agent) => {
                if (agent.type === AgentType.Rock) acc.rock++;
                if (agent.type === AgentType.Paper) acc.paper++;
                if (agent.type === AgentType.Scissors) acc.scissors++;
                if (agent.type === AgentType.Lizard) acc.lizard++;
                if (agent.type === AgentType.Spock) acc.spock++;
                return acc;
            }, { rock: 0, paper: 0, scissors: 0, lizard: 0, spock: 0, total: agents.length, wins: { ...winCounts } });
            stats.total = agents.length;
            onStatsUpdate(stats);
        }
      };
      
      p.mousePressed = () => {
        if (simulationStateRef.current === 'stopped') return;
        if (agentToAddRef.current !== null) {
          const type = agentToAddRef.current;
          const mousePos = p.createVector(p.mouseX, p.mouseY);
          
          const center = p.createVector(p.width / 2, p.height / 2);
          const arenaRadius = (p.width / 2) * settings.arenaRadiusMultiplier;

          if (mousePos.dist(center) < arenaRadius - AGENT_RADIUS) {
            agents.push(new Agent(nextAgentId++, type, false, mousePos));
            p.redraw();
          }
        }
      }
    };
    
    if (sketchRef.current) {
        if (p5InstanceRef.current) {
            p5InstanceRef.current.remove();
        }
        p5InstanceRef.current = new (window as any).p5(sketch, sketchRef.current);
    }
    
    return () => {
      p5InstanceRef.current?.remove();
      p5InstanceRef.current = null;
    };
  }, [settings, onStatsUpdate, gameMode]);
  
  useEffect(() => {
    const p5Instance = p5InstanceRef.current;
    if (!p5Instance) return;

    if (simulationState === 'running') {
        p5Instance.loop();
    } else if (simulationState === 'paused' || simulationState === 'stopped') {
        p5Instance.noLoop();
        p5Instance.redraw();
    }
  }, [simulationState]);


  return <div ref={sketchRef} className="w-full h-full" />;
};

export default Sketch;
