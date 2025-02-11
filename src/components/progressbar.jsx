import React, { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase"; // Firebase config

const db = getFirestore(app);
const auth = getAuth(app);

const ProgressBar = () => {
  const totalDuration = 3600; // 1 hour in seconds

  // Get saved progress from session storage or set default
  const storedProgress = sessionStorage.getItem("miningProgress");
  const storedStartTime = sessionStorage.getItem("miningStartTime");

  const [progress, setProgress] = useState(storedProgress ? parseFloat(storedProgress) : 0);
  const [miningPower, setMiningPower] = useState(0);
  const [miningValue, setMiningValue] = useState(0);
  const [isMining, setIsMining] = useState(storedStartTime !== null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setMiningPower(data.miningPower || 0);
          setMiningValue(data.miningValue || 0);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    let interval;

    if (isMining) {
      const startTime = storedStartTime ? parseInt(storedStartTime) : Date.now();
      sessionStorage.setItem("miningStartTime", startTime);

      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000; // Time in seconds
        const newProgress = (elapsed / totalDuration) * 100;

        if (newProgress >= 100) {
          clearInterval(interval);
          updateBalance();
          setIsMining(false);
          sessionStorage.removeItem("miningProgress");
          sessionStorage.removeItem("miningStartTime");
          setProgress(100);
        } else {
          setProgress(newProgress);
          sessionStorage.setItem("miningProgress", newProgress.toString());
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isMining]);

  const updateBalance = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const newBalance = (data.balance || 0) + miningPower * miningValue;

        await updateDoc(userRef, { balance: newBalance });
        console.log("Balance updated:", newBalance);
      }
    }
  };

  // Start mining when button is clicked
  const startMining = () => {
    setProgress(0); // Reset progress
    setIsMining(true);
    sessionStorage.setItem("miningProgress", "0");
    sessionStorage.setItem("miningStartTime", Date.now().toString());
  };

  // Calculate remaining time
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
