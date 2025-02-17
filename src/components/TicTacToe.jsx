import React, { useState, useEffect } from 'react';
import { X, Circle } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { app } from '../../firebase';
import { toast } from 'react-toastify';

const auth = getAuth(app);
const db = getFirestore(app);

const TicTacToe = ({ onBack }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setStatus(`Winner: ${winner}`);
      if (winner === 'X') {
        updateUserBalance();
      }
    } else if (board.every(Boolean)) {
      setStatus('Draw!');
    } else if (!isXNext) {
      setTimeout(() => {
        const computerMove = getComputerMove(board);
        if (computerMove !== null) handleClick(computerMove);
      }, 500);
    }
  }, [board]);

  const handleClick = (index) => {
    if (board[index] || status) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const updateUserBalance = async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      await updateDoc(userRef, { balance: (userData.balance || 0) + 10 });
      toast.success('🎉 You won! +10 balance added');
    }
  };

  const getComputerMove = (board) => {
    const emptySquares = board.map((val, idx) => (val === null ? idx : null)).filter(v => v !== null);

    // If AI can win, it moves there
    for (let move of emptySquares) {
      let newBoard = [...board];
      newBoard[move] = 'O';
      if (calculateWinner(newBoard) === 'O') return move;
    }

    // If AI can block X from winning, it moves there
    for (let move of emptySquares) {
      let newBoard = [...board];
      newBoard[move] = 'X';
      if (calculateWinner(newBoard) === 'X') return move;
    }

    // Otherwise, pick a random available spot
    return emptySquares.length ? emptySquares[Math.floor(Math.random() * emptySquares.length)] : null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setStatus('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[rgba(0,0,0,0.34)] text-white p-6">
      <p className="text-lg text-center mb-2">Win +10 Sincoins per game</p>
      <h1 className="text-3xl font-semibold mb-6">{status || `Next: ${isXNext ? 'X' : 'O'}`}</h1>
      <div className="grid grid-cols-3 gap-3 p-4 bg-gray-100 rounded-xl shadow-lg">
        {board.map((value, index) => (
          <button
            key={index}
            className="w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center bg-[rgba(0,0,0,0.34)] text-4xl rounded-lg shadow-md hover:shadow-xl transition-all duration-200"
            onClick={() => handleClick(index)}
          >
            {value === 'X' ? <X className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" /> : value === 'O' ? <Circle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500" /> : null}
          </button>
        ))}
      </div>
      <div className="flex gap-4 mt-6">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200" onClick={resetGame}>Reset Game</button>
        <button className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all duration-200" onClick={onBack}>Back to Game Selection</button>
      </div>
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
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
