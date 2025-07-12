'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type VariableLevel = 'low' | 'medium' | 'high';

interface TeamBuilderState {
  thisSeason: VariableLevel;
  venue: VariableLevel;
  opponent: VariableLevel;
}

interface Player {
  name: string;
  role: string;
  team: string;
  points: number;
  form?: string;
  recentScores?: string[];
}

interface DummyTeam {
  wicketKeeper: Player;
  batters: Player[];
  allRounders: Player[];
  bowlers: Player[];
}

const dummyTeam: DummyTeam = {
  wicketKeeper: { 
    name: "MS Dhoni", 
    role: "WK-Batter", 
    team: "CSK", 
    points: 145,
    form: "Excellent",
    recentScores: ["32*", "28*", "45"]
  },
  batters: [
    { 
      name: "Virat Kohli", 
      role: "Batter", 
      team: "RCB", 
      points: 150,
      form: "Outstanding",
      recentScores: ["100*", "85", "76"]
    },
    { 
      name: "Rohit Sharma", 
      role: "Batter", 
      team: "MI", 
      points: 130,
      form: "Good",
      recentScores: ["45", "67", "32"]
    },
    { 
      name: "KL Rahul", 
      role: "Batter", 
      team: "LSG", 
      points: 125,
      form: "Average",
      recentScores: ["34", "45", "28"]
    },
  ],
  allRounders: [
    { 
      name: "Ravindra Jadeja", 
      role: "All-Rounder", 
      team: "CSK", 
      points: 135,
      form: "Excellent",
      recentScores: ["45*", "3/24", "38 & 2/30"]
    },
    { 
      name: "Hardik Pandya", 
      role: "All-Rounder", 
      team: "MI", 
      points: 128,
      form: "Good",
      recentScores: ["35 & 2/25", "42", "1/28"]
    },
  ],
  bowlers: [
    { 
      name: "Jasprit Bumrah", 
      role: "Bowler", 
      team: "MI", 
      points: 140,
      form: "Excellent",
      recentScores: ["3/25", "2/22", "4/30"]
    },
    { 
      name: "Mohammed Shami", 
      role: "Bowler", 
      team: "GT", 
      points: 122,
      form: "Good",
      recentScores: ["2/30", "3/25", "1/28"]
    },
    { 
      name: "Yuzvendra Chahal", 
      role: "Bowler", 
      team: "RR", 
      points: 118,
      form: "Average",
      recentScores: ["2/35", "1/28", "2/32"]
    },
    { 
      name: "Rashid Khan", 
      role: "Bowler", 
      team: "GT", 
      points: 132,
      form: "Excellent",
      recentScores: ["3/22", "2/18", "4/25"]
    },
  ]
};

interface PlayerCardProps {
  player: Player;
  className?: string;
  index?: number;
}

const getFormColor = (form: string) => {
  switch (form?.toLowerCase()) {
    case 'outstanding':
      return 'text-green-400';
    case 'excellent':
      return 'text-green-300';
    case 'good':
      return 'text-blue-300';
    case 'average':
      return 'text-yellow-300';
    default:
      return 'text-gray-300';
  }
};

interface SliderProps {
  label: string;
  value: VariableLevel;
  onChange: (value: VariableLevel) => void;
  description?: string;
}

const PerformanceSlider = ({ label, value, onChange, description }: SliderProps) => {
  const getProgressWidth = () => {
    switch (value) {
      case 'low':
        return 'calc(0% + 3.5px)';
      case 'medium':
        return 'calc(50% + 3.5px)';
      case 'high':
        return 'calc(100% + 3.5px)';
    }
  };

  const getKnobPosition = () => {
    switch (value) {
      case 'low':
        return 'calc(0% + 3.5px)';
      case 'medium':
        return 'calc(50%)';
      case 'high':
        return 'calc(100% - 3.5px)';
    }
  };

  const getStatusColor = () => {
    switch (value) {
      case 'low':
        return 'bg-red-500/5 text-red-400';
      case 'medium':
        return 'bg-blue-500/5 text-blue-400';
      case 'high':
        return 'bg-green-500/5 text-green-400';
    }
  };

  return (
    <div className="space-y-6 pb-2">
      <div>
        <div className="flex justify-between items-center mb-1">
          <p className="text-base text-gray-300">
            {label}
          </p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusColor()}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          {description}
        </p>
      </div>
      
      <div className="relative">
        <div className="flex justify-between text-[10px] text-gray-500 mb-1 px-1">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
        
        <div className="flex-1 h-6 bg-[#0E1323] rounded-full relative group px-3">
          <input
            type="range"
            min="0"
            max="2"
            value={value === 'low' ? 0 : value === 'medium' ? 1 : 2}
            onChange={(e) => {
              const value = ['low', 'medium', 'high'][parseInt(e.target.value)] as VariableLevel;
              onChange(value);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          
          {/* Track Background */}
          <div 
            className="absolute h-1.5 top-1/2 -translate-y-1/2 left-3 bg-[#5A8DEE]/30 rounded-full transition-all duration-200"
            style={{ width: getProgressWidth() }}
          />
          
          {/* Track Steps */}
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between">
            <div className={`w-0.5 h-1.5 rounded-full transition-colors duration-200 
              ${value === 'low' ? 'bg-white' : 'bg-gray-700'}`} />
            <div className={`w-0.5 h-1.5 rounded-full transition-colors duration-200 
              ${value === 'medium' ? 'bg-white' : 'bg-gray-700'}`} />
            <div className={`w-0.5 h-1.5 rounded-full transition-colors duration-200 
              ${value === 'high' ? 'bg-white' : 'bg-gray-700'}`} />
          </div>

          {/* Sliding Knob */}
          <div 
            className="absolute h-6 w-6 -ml-3 flex items-center justify-center transition-all duration-200 transform"
            style={{ left: getKnobPosition() }}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-lg ring-1 ring-[#5A8DEE] group-hover:ring-2 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TeamBuilder() {
  const [state, setState] = useState<TeamBuilderState>({
    thisSeason: 'medium',
    venue: 'medium',
    opponent: 'medium',
  });
  const [showTeam, setShowTeam] = useState(false);

  const handleSliderChange = (variable: keyof TeamBuilderState, value: VariableLevel) => {
    setState(prev => ({ ...prev, [variable]: value }));
  };

  const PlayerCard = ({ player, className = "", index = 0 }: PlayerCardProps) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative group ${className}`}
    >
      <div className="absolute inset-0 bg-[#5A8DEE] rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity"></div>
      <div className="bg-[#0E1323] backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-[#5A8DEE]/20 hover:shadow-xl transition-all cursor-pointer border border-gray-800 hover:border-[#5A8DEE]/30">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-white font-semibold">{player.name}</p>
              <span className={`text-xs font-medium ${getFormColor(player.form || '')}`}>
                {player.form}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-2">{player.team} • {player.role}</p>
            {player.recentScores && (
              <div className="flex gap-2">
                {player.recentScores.map((score, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded bg-[#1A1F3C] text-[#5A8DEE]">
                    {score}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end">
            <div className="bg-[#1A1F3C] px-3 py-1 rounded-full">
              <p className="text-[#5A8DEE] font-semibold">{player.points}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0E1323] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12 text-white"
        >
          Build Your Dream Team
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-8">
          {/* Controls Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-[#1A1F3C]/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
              <div className="space-y-8">
                <PerformanceSlider
                  label="This Season Performance"
                  value={state.thisSeason}
                  onChange={(value) => handleSliderChange('thisSeason', value)}
                  description="How much should recent form matter?"
                />

                <PerformanceSlider
                  label="Venue Performance"
                  value={state.venue}
                  onChange={(value) => handleSliderChange('venue', value)}
                  description="How important is the player's venue record?"
                />

                <PerformanceSlider
                  label="Opponent Performance"
                  value={state.opponent}
                  onChange={(value) => handleSliderChange('opponent', value)}
                  description="How crucial is past performance against this opponent?"
                />

                <button
                  onClick={() => setShowTeam(true)}
                  className="w-full py-2.5 px-4 bg-[#5A8DEE] text-white font-medium rounded-lg hover:bg-[#4A7DDE] transition-colors"
                >
                  Create My Team
                </button>
              </div>
            </div>
          </motion.div>

          {/* Cricket Field Layout */}
          {showTeam && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[#1A1F3C] rounded-xl shadow-lg p-6 border border-gray-800"
            >
              <div className="relative min-h-[700px] rounded-3xl bg-[#0E1323] p-6 overflow-hidden">
                {/* Field Decorations */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20"></div>
                
                {/* Pitch */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-24 h-[600px] bg-[#1A1F3C] rounded-full opacity-40"></div>
                </div>

                {/* Players Layout */}
                <div className="relative h-full flex flex-col justify-between">
                  {/* Batters Row */}
                  <div className="flex justify-center gap-6 pt-4">
                    {dummyTeam.batters.map((batter, index) => (
                      <PlayerCard 
                        key={batter.name} 
                        player={batter}
                        className="w-72"
                        index={index}
                      />
                    ))}
                  </div>

                  {/* All Rounders Row */}
                  <div className="flex justify-center gap-16 py-12">
                    {dummyTeam.allRounders.map((allRounder, index) => (
                      <PlayerCard 
                        key={allRounder.name} 
                        player={allRounder}
                        className="w-72"
                        index={index + 3}
                      />
                    ))}
                  </div>

                  {/* Bowlers Row */}
                  <div className="flex justify-center flex-wrap gap-6 py-12 px-12">
                    {dummyTeam.bowlers.map((bowler, index) => (
                      <PlayerCard 
                        key={bowler.name} 
                        player={bowler}
                        className="w-72"
                        index={index + 5}
                      />
                    ))}
                  </div>

                  {/* Wicket Keeper */}
                  <div className="flex justify-center pb-4">
                    <PlayerCard 
                      player={dummyTeam.wicketKeeper}
                      className="w-72"
                      index={9}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 