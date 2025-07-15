// src/App.jsx
import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import BattingStats from "./components/BattingStats";

const normalize = (str) => (str || "").trim().toLowerCase().replace(/\s+/g, " ");


const App = () => {
  const [matchData, setMatchData] = useState([]);
  const [battingData, setBattingData] = useState([]);
  const [filteredBattingStats, setFilteredBattingStats] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("batting");

  const trimLower = (val) => (val || "").trim().toLowerCase();

  useEffect(() => {
    d3.csv("/data/match_info_cleaned.csv")
      .then((data) => {
        const parseDate = (str) => {
          if (!str) return new Date(0);
          const [day, month, year] = str.trim().split(/[-\/]/);
          return new Date(`${year}-${month}-${day}`);
        };

        const sorted = data
          .filter((m) => m.date?.trim())
          .sort((a, b) => parseDate(b.date) - parseDate(a.date));

        console.log("✅ match data loaded:", sorted);
        setMatchData(sorted);
      })
      .catch((err) => console.error("❌ Error loading match_info_1.csv:", err));
  }, []);

  useEffect(() => {
    d3.csv("/data/batting_1.csv")
      .then((data) => {
        console.log("✅ batting data loaded:", data);
        setBattingData(data);
      })
      .catch((err) => console.error("❌ Error loading batting_1.csv:", err));
  }, []);

  // Helper to normalize string (already mentioned before)
 let hasLogged = false;

useEffect(() => {
  if (matchData.length > 0 && battingData.length > 0) {
    const latestMatch = matchData[0];
    const matchId = (latestMatch.match_id || "").trim();
    const team1 = (latestMatch.team1 || "").trim().toLowerCase();
    const team2 = (latestMatch.team2 || "").trim().toLowerCase();

    const normalize = (val) => (val || "").trim().toLowerCase();

    const filtered = battingData.filter((row) => {
      const rowMatchId = normalize(row.match_id);
      const rowTeam = normalize(row.player_team);
      return (
        rowMatchId === normalize(matchId) &&
        (rowTeam === team1 || rowTeam === team2)
      );
    });

    const seen = new Set();
    const unique = [];

    for (const row of filtered) {
      const key = normalize(row.player_name);
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(row);
      }
    }

    if (!hasLogged) {
      console.log("✅ Final filtered batting stats:", unique);
      hasLogged = true;
    }

    setFilteredBattingStats(unique);
  }
}, [matchData, battingData]);




  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Match Info */}
      {matchData.length > 0 ? (
        <div className="bg-purple-100 border-l-4 border-purple-600 p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold text-purple-800">
            {matchData[0].team1?.trim()} vs {matchData[0].team2?.trim()}
          </h2>
          <p className="text-gray-700">📍 Venue: {matchData[0].venue}</p>
          <p className="text-gray-700">🗓 Date: {matchData[0].date}</p>
        </div>
      ) : (
        <p className="text-gray-500">Loading match data...</p>
      )}

      {/* Category Switch */}
      <div className="flex justify-center gap-4 mb-4">
        {["batting", "bowling", "allrounder"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-semibold border ${selectedCategory === cat
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-700 border-purple-300"
              } transition`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
           {selectedCategory === "batting" && (
        <BattingStats battingStats={filteredBattingStats} />
      )}
      {selectedCategory === "bowling" && (
        <div className="text-center text-gray-400">Bowling stats coming soon...</div>
      )}
      {selectedCategory === "allrounder" && (
        <div className="text-center text-gray-400">Allrounder stats coming soon...</div>
      )}

    </div>
  );
};

export default App;
