import React, { useState, useEffect } from 'react';
import { X, Circle } from 'lucide-react'; // Importing X and Circle icons from Lucide

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setStatus(`Winner: ${winner}`);
    } else if (board.every(Boolean)) {
      setStatus('Draw!');
    } else if (!winner && !board.every(Boolean)) {
      if (!isXNext) {
        const computerMove = getComputerMove(board);
        handleClick(computerMove);
      }
    }
  }, [board, isXNext]);

  const handleClick = (index) => {
    if (board[index] || status) return;

    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const getComputerMove = (board) => {
    // Check for winning move
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const newBoard = board.slice();
        newBoard[i] = 'O';
        if (calculateWinner(newBoard)) return i;
      }
    }
    // Block player's winning move
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const newBoard = board.slice();
        newBoard[i] = 'X';
        if (calculateWinner(newBoard)) return i;
      }
    }
    // Take the first available spot
    return board.findIndex(square => square === null);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setStatus('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold mb-4">{status || `Next player: ${isXNext ? 'X' : 'O'}`}</h1>
      <div className="grid grid-cols-3 gap-4">
        {board.map((value, index) => (
          <button
            key={index}
            className="w-24 h-24 flex items-center justify-center text-4xl font-bold bg-green-500 hover:bg-green-700 rounded"
            onClick={() => handleClick(index)}
          >
            {value === 'X' ? <X className="w-16 h-16 text-white" /> : value === 'O' ? <Circle className="w-16 h-16 text-blue-500" /> : null}
          </button>
        ))}
      </div>
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={resetGame}
      >
        Reset Game
      </button>
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default TicTacToe;
