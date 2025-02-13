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
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const newBoard = board.slice();
        newBoard[i] = 'O';
        if (calculateWinner(newBoard)) return i;
      }
    }
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const newBoard = board.slice();
        newBoard[i] = 'X';
        if (calculateWinner(newBoard)) return i;
      }
    }
    return board.findIndex(square => square === null);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setStatus('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 p-6">
      <p className="text-2xl">Play simple Tic Tac Toe game to earn+10 extra sincoins per win <p/>
      <h1 className="text-3xl font-semibold mb-6">{status || `Next: ${isXNext ? '<X className="w-16 h-16 text-blue-600" />' : '<Circle className="w-16 h-16 text-red-500" />'}`}</h1>
      <div className="grid grid-cols-3 gap-3 p-4 bg-gray-100 rounded-xl shadow-xl">
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
