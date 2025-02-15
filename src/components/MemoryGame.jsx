import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { app } from '../../firebase';
import { toast } from 'react-toastify';

const auth = getAuth(app);
const db = getFirestore(app);

const MemoryGame = ({ onBack }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [status, setStatus] = useState('');

  const cardImages = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍑', '🍍', '🥭'];

  useEffect(() => {
    initializeCards();
  }, []);

  useEffect(() => {
    if (solved.length === cardImages.length * 2) {
      setStatus('You won!');
      updateUserBalance();
    }
  }, [solved]);

  const initializeCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({ id: index, image, flipped: false }));
    setCards(shuffledCards);
  };

  const handleClick = (id) => {
    if (flipped.length === 2 || solved.includes(id)) return;
    const newCards = cards.map(card => 
      card.id === id ? { ...card, flipped: true } : card
    );
    setCards(newCards);
    setFlipped([...flipped, id]);

    if (flipped.length === 1) {
      const firstCard = cards.find(card => card.id === flipped[0]);
      const secondCard = cards.find(card => card.id === id);
      if (firstCard.image === secondCard.image) {
        setSolved([...solved, firstCard.id, secondCard.id]);
      }
      setTimeout(() => {
        setCards(cards.map(card => 
          solved.includes(card.id) || card.id === flipped[0] || card.id === id ? card : { ...card, flipped: false }
        ));
        setFlipped([]);
      }, 1000);
    }
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

  const resetGame = () => {
    initializeCards();
    setFlipped([]);
    setSolved([]);
    setStatus('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white text-gray-900 p-6">
      <p className="text-lg text-center mb-2">Win +10 Sincoins per game</p>
      <h1 className="text-3xl font-semibold mb-6">{status || 'Memory Game'}</h1>
      <div className="grid grid-cols-4 gap-3 p-4 bg-gray-100 rounded-xl shadow-lg">
        {cards.map((card) => (
          <button
            key={card.id}
            className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-white text-4xl rounded-lg shadow-md hover:shadow-xl transition-all duration-200"
            onClick={() => handleClick(card.id)}
          >
            {card.flipped || solved.includes(card.id) ? card.image : '❓'}
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

export default MemoryGame;
