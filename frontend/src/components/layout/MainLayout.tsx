'use client';

import React, { useEffect, useState, useCallback, ReactNode } from 'react';
import { api, BatterFormSummary, BowlerFormSummary, AllRounderFormSummary, PlayerCategory, FilterType, VisibleContest, BatterVenueSummary, BowlerVenueSummary, AllRounderVenueSummary, BatterOpponentSummary, BowlerOpponentSummary, AllRounderOpponentSummary } from '@/lib/api';
import BatterCard from '../player/BatterCard';
import { BowlerCard } from '../player/BowlerCard';
import AllRounderCard from '../player/AllRounderCard';
import Spinner from '../ui/Spinner';
import DataControls from '../controls/DataControls';
import GameSelector, { Game } from '../controls/GameSelector';

interface MainLayoutProps {
  children: ReactNode;
  showControls?: boolean;
}

// Transform VisibleContest to Game interface
const mapContestToGame = (contest: VisibleContest): Game => ({
  id: contest.match_id,
  team1: contest.team1_abbr,
  team2: contest.team2_abbr,
  venue: contest.venue,
  time: contest.match_time,
});

const MainLayout: React.FC<MainLayoutProps> = ({ children, showControls = true }) => {
  const [batsmenData, setBatsmenData] = useState<BatterFormSummary[]>([]);
  const [batsmenVenueData, setBatsmenVenueData] = useState<BatterVenueSummary[]>([]);
  const [batsmenOpponentData, setBatsmenOpponentData] = useState<BatterOpponentSummary[]>([]);
  const [bowlersData, setBowlersData] = useState<BowlerFormSummary[]>([]);
  const [bowlersVenueData, setBowlersVenueData] = useState<BowlerVenueSummary[]>([]);
  const [bowlersOpponentData, setBowlersOpponentData] = useState<BowlerOpponentSummary[]>([]);
  const [allRoundersData, setAllRoundersData] = useState<AllRounderFormSummary[]>([]);
  const [allRoundersVenueData, setAllRoundersVenueData] = useState<AllRounderVenueSummary[]>([]);
  const [allRoundersOpponentData, setAllRoundersOpponentData] = useState<AllRounderOpponentSummary[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<PlayerCategory>('Batsmen');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('This Season');
  const [selectedGameId, setSelectedGameId] = useState<string>('');

  // Fetch games with retry mechanism
  const fetchGames = useCallback(async (retryCount = 0) => {
    try {
      const contests = await api.getVisibleContests();
      const mappedGames = contests.map(mapContestToGame);
      setGames(mappedGames);
      
      // Set the first game as selected if there are games and no game is selected
      if (mappedGames.length > 0 && !selectedGameId) {
        setSelectedGameId(mappedGames[0].id);
      }
      setError(null);
    } catch (error) {
      console.error('Failed to fetch games:', error);
      if (retryCount < 3) {
        // Exponential backoff retry
        const timeout = Math.pow(2, retryCount) * 1000;
        setTimeout(() => fetchGames(retryCount + 1), timeout);
      } else {
        setError('Failed to load games. Please try again.');
      }
    }
  }, [selectedGameId]);

  // Fetch player data with retry mechanism
  const fetchPlayerData = useCallback(async (retryCount = 0) => {
    if (!selectedGameId) return;

    try {
      setLoading(true);
      setError(null);

      let data;
      switch (selectedCategory) {
        case 'Batsmen':
          if (selectedFilter === 'This Season') {
            data = await api.getBatsmenSeasonForm(selectedGameId);
            setBatsmenData(data);
            setBatsmenVenueData([]);
            setBatsmenOpponentData([]);
          } else if (selectedFilter === 'At Venue') {
            data = await api.getBatsmenVenueForm(selectedGameId);
            setBatsmenVenueData(data);
            setBatsmenData([]);
            setBatsmenOpponentData([]);
          } else if (selectedFilter === 'Vs. Opponent') {
            data = await api.getBatsmenOpponentForm(selectedGameId);
            setBatsmenOpponentData(data);
            setBatsmenData([]);
            setBatsmenVenueData([]);
          }
          setBowlersData([]);
          setBowlersVenueData([]);
          setBowlersOpponentData([]);
          setAllRoundersData([]);
          setAllRoundersVenueData([]);
          break;
        case 'Bowlers':
          if (selectedFilter === 'This Season') {
            data = await api.getBowlersSeasonForm(selectedGameId);
            setBowlersData(data);
            setBowlersVenueData([]);
            setBowlersOpponentData([]);
          } else if (selectedFilter === 'At Venue') {
            data = await api.getBowlersVenueForm(selectedGameId);
            setBowlersVenueData(data);
            setBowlersData([]);
            setBowlersOpponentData([]);
          } else if (selectedFilter === 'Vs. Opponent') {
            data = await api.getBowlersOpponentForm(selectedGameId);
            setBowlersOpponentData(data);
            setBowlersData([]);
            setBowlersVenueData([]);
          }
          setBatsmenData([]);
          setBatsmenVenueData([]);
          setBatsmenOpponentData([]);
          setAllRoundersData([]);
          setAllRoundersVenueData([]);
          break;
        case 'All Rounders':
          if (selectedFilter === 'This Season') {
            data = await api.getAllRoundersSeasonForm(selectedGameId);
            setAllRoundersData(data);
            setAllRoundersVenueData([]);
            setAllRoundersOpponentData([]);
          } else if (selectedFilter === 'At Venue') {
            data = await api.getAllRoundersVenueForm(selectedGameId);
            setAllRoundersVenueData(data);
            setAllRoundersData([]);
            setAllRoundersOpponentData([]);
          } else if (selectedFilter === 'Vs. Opponent') {
            data = await api.getAllRoundersOpponentForm(selectedGameId);
            setAllRoundersOpponentData(data);
            setAllRoundersData([]);
            setAllRoundersVenueData([]);
          }
          setBatsmenData([]);
          setBatsmenVenueData([]);
          setBatsmenOpponentData([]);
          setBowlersData([]);
          setBowlersVenueData([]);
          setBowlersOpponentData([]);
          break;
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      if (retryCount < 3) {
        // Exponential backoff retry
        const timeout = Math.pow(2, retryCount) * 1000;
        setTimeout(() => fetchPlayerData(retryCount + 1), timeout);
      } else {
        setError('Failed to fetch player data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedFilter, selectedGameId]);

  // Initial games fetch
  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  // Fetch player data when selection changes
  useEffect(() => {
    fetchPlayerData();
  }, [fetchPlayerData]);

  const selectedGame = games.find(game => game.id === selectedGameId);

  // Render loading state
  if (!selectedGame && loading) {
    return (
      <div className="min-h-screen bg-[#0E1323] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E1323]">
      <div className="py-12">
        <main className="container mx-auto px-4 md:px-8">
          {showControls && (
            <>
              {/* Game Selector */}
              <div className="mb-8">
                <GameSelector
                  games={games}
                  selectedGameId={selectedGameId}
                  onGameChange={setSelectedGameId}
                />
              </div>

              {/* Controls */}
              <div className="mb-12">
                <DataControls
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  selectedFilter={selectedFilter}
                  onFilterChange={setSelectedFilter}
                />
              </div>

              {/* Error State with Retry */}
              {error && (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button
                    onClick={() => {
                      setError(null);
                      setLoading(true);
                      fetchGames();
                      fetchPlayerData();
                    }}
                    className="px-4 py-2 bg-[#5A8DEE] text-white rounded-lg hover:bg-[#4A7DDE] transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Content Sections */}
              {!error && (
                <div className={loading ? 'opacity-50' : 'opacity-100'}>
                  {/* Batsmen Section - This Season */}
                  {selectedCategory === 'Batsmen' && selectedFilter === 'This Season' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {batsmenData.map((player, index) => (
                        <BatterCard 
                          key={player.player_name} 
                          player={player} 
                          index={index}
                          viewType="season"
                        />
                      ))}
                    </div>
                  )}

                  {/* Batsmen Section - At Venue */}
                  {selectedCategory === 'Batsmen' && selectedFilter === 'At Venue' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...batsmenVenueData]
                        .sort((a, b) => (b.avg_fantasy_points || 0) - (a.avg_fantasy_points || 0))
                        .map((player, index) => (
                          <BatterCard 
                            key={player.player_name} 
                            player={player} 
                            index={index}
                            viewType="venue"
                          />
                        ))}
                    </div>
                  )}

                  {/* Batsmen Section - Vs. Opponent */}
                  {selectedCategory === 'Batsmen' && selectedFilter === 'Vs. Opponent' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...batsmenOpponentData]
                        .sort((a, b) => (b.fantasy_points_per_game || 0) - (a.fantasy_points_per_game || 0))
                        .map((player, index) => (
                          <BatterCard 
                            key={player.player_name} 
                            player={player} 
                            index={index}
                            viewType="opponent"
                          />
                        ))}
                    </div>
                  )}

                  {/* Bowlers Section - This Season */}
                  {selectedCategory === 'Bowlers' && selectedFilter === 'This Season' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...bowlersData]
                        .sort((a, b) => (b.fantasy_points || 0) - (a.fantasy_points || 0))
                        .map((player, index) => (
                          <BowlerCard 
                            key={player.player_name} 
                            player={player} 
                            index={index}
                            viewType="season"
                          />
                        ))}
                    </div>
                  )}

                  {/* Bowlers Section - At Venue */}
                  {selectedCategory === 'Bowlers' && selectedFilter === 'At Venue' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...bowlersVenueData]
                        .sort((a, b) => (b.fantasy_points_per_game || 0) - (a.fantasy_points_per_game || 0))
                        .map((player, index) => (
                          <BowlerCard 
                            key={player.player_name} 
                            player={player} 
                            index={index}
                            viewType="venue"
                          />
                        ))}
                    </div>
                  )}

                  {/* Bowlers Section - Vs. Opponent */}
                  {selectedCategory === 'Bowlers' && selectedFilter === 'Vs. Opponent' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...bowlersOpponentData]
                        .sort((a, b) => (b.fantasy_points_per_game || 0) - (a.fantasy_points_per_game || 0))
                        .map((player, index) => (
                          <BowlerCard 
                            key={player.player_name} 
                            player={player} 
                            index={index}
                            viewType="opponent"
                          />
                        ))}
                    </div>
                  )}

                  {/* All Rounders Section - This Season */}
                  {selectedCategory === 'All Rounders' && selectedFilter === 'This Season' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...allRoundersData]
                        .sort((a, b) => (b.fantasy_points || 0) - (a.fantasy_points || 0))
                        .map((player, index) => (
                          <AllRounderCard 
                            key={player.player_name} 
                            player={player} 
                            index={index}
                            viewType="season"
                          />
                        ))}
                    </div>
                  )}

                  {/* All Rounders Section - At Venue */}
                  {selectedCategory === 'All Rounders' && selectedFilter === 'At Venue' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...allRoundersVenueData]
                        .sort((a, b) => (b.fantasy_points_per_game || 0) - (a.fantasy_points_per_game || 0))
                        .map((player, index) => (
                          <AllRounderCard 
                            key={player.player_name} 
                            player={player} 
                            index={index}
                            viewType="venue"
                          />
                        ))}
                    </div>
                  )}

                  {/* All Rounders Section - Vs. Opponent */}
                  {selectedCategory === 'All Rounders' && selectedFilter === 'Vs. Opponent' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...allRoundersOpponentData]
                        .sort((a, b) => (b.fantasy_points_per_game || 0) - (a.fantasy_points_per_game || 0))
                        .map((player, index) => (
                          <AllRounderCard 
                            key={player.player_name} 
                            player={player} 
                            index={index}
                            viewType="opponent"
                          />
                        ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 