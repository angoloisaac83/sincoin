import React, { useState } from 'react';
import TicTacToe from './TicTacToe'; // Import your TicTacToe component
import MemoryGame from './MemoryGame'; // Import your MemoryGame component

const GameSelection = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white text-gray-900 p-6">
      {!selectedGame ? (
        <>
          <h1 className="text-3xl font-semibold mb-6">Choose a Game</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
              onClick={() => setSelectedGame('tic-tac-toe')}
            >
              Play Tic-Tac-Toe
            </button>
            <button
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-200"
              onClick={() => setSelectedGame('memory-game')}
            >
              Play Memory Game
            </button>
          </div>
        </>
      ) : (
        <>
          {selectedGame === 'tic-tac-toe' && (
            <TicTacToe onBack={() => setSelectedGame(null)} />
          )}
          {selectedGame === 'memory-game' && (
            <MemoryGame onBack={() => setSelectedGame(null)} />
          )}
        </>
      )}
    </div>
  );
};

export default GameSelection;
