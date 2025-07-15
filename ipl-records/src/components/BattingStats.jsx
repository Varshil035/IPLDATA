// src/components/BattingStats.jsx
import React from "react";

const BattingStats = ({ battingStats }) => {
  if (!battingStats || battingStats.length === 0) {
    return <p className="text-gray-500">No batting data available.</p>;
  }

  return (
    <div className="space-y-2 mt-6">
      <div className="grid grid-cols-4 bg-purple-700 text-white font-semibold p-3 rounded-t-xl">
        <div className="text-center">Player</div>
        <div className="text-center">Avg</div>
        <div className="text-center">Runs</div>
        <div className="text-center">SR</div>
      </div>

      {battingStats.map((b, i) => {
        const runs = parseInt(b.R || 0);
        const balls = parseInt(b.B || 0);
        const sr = balls > 0 ? ((runs / balls) * 100).toFixed(2) : "0.00";
        const avg = b.out_details?.toLowerCase() === "not out" ? "N/A" : (runs / 1).toFixed(2);

        return (
          <div
            key={i}
            className="grid grid-cols-4 bg-white rounded-md shadow p-3 hover:bg-purple-50 transition"
          >
            <div className="text-purple-800 text-center font-medium">{b.player_name}</div>
            <div className="text-center">{avg}</div>
            <div className="text-center">{runs}</div>
            <div className="text-center">{sr}</div>
          </div>
        );
      })}
    </div>
  );
};


export default BattingStats;
