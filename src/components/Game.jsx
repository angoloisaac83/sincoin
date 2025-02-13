import React, { useState, useEffect } from 'react';
import { X, Circle } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { app } from '../../firebase';
import { toast } from 'react-toastify';

const auth = getAuth(app);
const db = getFirestore(app);

const TicTacToe = () => {
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
        handleClick(computerMove);
      }, 500); // Adds a delay to feel more natural
    }
  }, [board, isXNext]);

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
    // 1. Check for winning move
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = 'O';
        if (calculateWinner(newBoard)) return i;
      }
    }
    
    // 2. Block player’s winning move
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = 'X';
        if (calculateWinner(newBoard)) return i;
      }
    }

    // 3. Take the center if available
    if (!board[4]) return 4;

    // 4. Pick a random available corner
    const corners = [0, 2, 6, 8].filter(i => !board[i]);
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

    // 5. Pick a random available side
    const sides = [1, 3, 5, 7].filter(i => !board[i]);
    if (sides.length) return sides[Math.floor(Math.random() * sides.length)];

    return board.findIndex(square => square === null);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setStatus('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white text-gray-900 p-6">
      <p className="text-lg text-center mb-2">Win +10 Sincoins per game</p>
      <h1 className="text-3xl font-semibold mb-6">{status || `Next: ${isXNext ? 'X' : 'O'}`}</h1>
      <div className="grid grid-cols-3 gap-3 p-4 bg-gray-100 rounded-xl shadow-lg">
        {board.map((value, index) => (
          <button
            key={index}
            className="w-24 h-24 flex items-center justify-center bg-white text-4xl rounded-lg shadow-md hover:shadow-xl transition-all duration-200"
            onClick={() => handleClick(index)}
          >
            {value === 'X' ? <X className="w-16 h-16 text-blue-600" /> : value === 'O' ? <Circle className="w-16 h-16 text-red-500" /> : null}
          </button>
        ))}
      </div>
      <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200" onClick={resetGame}>Reset Game</button>
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
