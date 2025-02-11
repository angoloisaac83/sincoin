import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../firebase"; // Firebase config

const db = getFirestore(app);
const auth = getAuth(app);

const ProgressBar = () => {
  const totalDuration = 3600; // 1 hour (adjust as needed)
  
  const [progress, setProgress] = useState(0);
  const [miningPower, setMiningPower] = useState(1);
  const [miningValue, setMiningValue] = useState(1);
  const [isMining, setIsMining] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserData(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    if (!uid) return;
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      setMiningPower(data.miningPower || 1);
      setMiningValue(data.miningValue || 1);
      setStartTime(data.miningStartTime || null);
      setIsMining(!!data.miningStartTime);
    }
  };

  useEffect(() => {
    let interval;

    if (isMining && startTime) {
      interval = setInterval(async () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const newProgress = (elapsed / totalDuration) * 100;

        if (newProgress >= 100) {
          clearInterval(interval);
          await completeMining();
        } else {
          setProgress(newProgress);
          await updateDoc(doc(db, "users", userId), { miningProgress: newProgress });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isMining, startTime]);

  const completeMining = async () => {
    setIsMining(false);
    setProgress(100);

    if (!userId) return;

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      const earnings = miningPower * miningValue;
      const newBalance = (data.balance || 0) + earnings;

      try {
        await updateDoc(userRef, { 
          balance: newBalance, 
          miningStartTime: null, 
          miningProgress: 0 
        });
        console.log("Balance updated:", newBalance);
      } catch (error) {
        console.error("Failed to update balance:", error);
      }
    }
  };

  const startMining = async () => {
    const startTime = Date.now();
    setProgress(0);
    setIsMining(true);
    setStartTime(startTime);

    await updateDoc(doc(db, "users", userId), {
      miningStartTime: startTime,
      miningProgress: 0
    });
  };

  const timeLeft = totalDuration - (progress / 100) * totalDuration;
  const minutesLeft = Math.floor(timeLeft / 60);
  const secondsLeft = Math.floor(timeLeft % 60);

  return (
    <div className="w-full max-w-md mx-auto px-6 mt-10 text-center">
      {!isMining ? (
        <button
          onClick={startMining}
          className="bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
        >
          Start Mining
        </button>
      ) : (
        <>
          <div className="bg-gray-300 rounded-full overflow-hidden h-6 w-full mt-4">
            <div
              className="bg-green-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-lg font-semibold mt-2">
            Time Left: {minutesLeft}m {secondsLeft}s
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressBar;
