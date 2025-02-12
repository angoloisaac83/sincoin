import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../firebase";

const db = getFirestore(app);
const auth = getAuth(app);

const ProgressBar = () => {
  const totalDuration = 3600; // 1 hour in seconds

  const [progress, setProgress] = useState(0);
  const [miningPower, setMiningPower] = useState(1);
  const [miningValue, setMiningValue] = useState(1);
  const [isMining, setIsMining] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [userId, setUserId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(totalDuration);

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
      setMiningPower(data.miningpower || 1);
      setMiningValue(data.miningvalue || 1);
      const savedStartTime = data.miningStartTime || null;

      if (savedStartTime) {
        const elapsed = Math.floor((Date.now() - savedStartTime) / 1000);
        if (elapsed >= totalDuration) {
          await completeMining(uid);
        } else {
          setStartTime(savedStartTime);
          setTimeLeft(totalDuration - elapsed);
          setProgress((elapsed / totalDuration) * 100);
          setIsMining(true);
        }
      }
    }
  };

  useEffect(() => {
    let interval;

    if (isMining && startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const newProgress = (elapsed / totalDuration) * 100;
        const remainingTime = totalDuration - elapsed;

        if (remainingTime <= 0) {
          clearInterval(interval);
          completeMining(userId);
        } else {
          setProgress(newProgress);
          setTimeLeft(remainingTime);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isMining, startTime]);

  const completeMining = async (uid) => {
    if (!uid) return;

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      const earnings = miningPower * miningValue;
      const newBalance = (data.balance || 0) + earnings;

      try {
        await updateDoc(userRef, { 
          balance: newBalance, 
          miningStartTime: null
        });
        console.log("Balance updated:", newBalance);
      } catch (error) {
        console.error("Failed to update balance:", error);
      }
    }

    setIsMining(false);
    setProgress(100);
    setTimeLeft(totalDuration);
  };

  const startMining = async () => {
    const newStartTime = Date.now();
    setStartTime(newStartTime);
    setProgress(0);
    setIsMining(true);
    setTimeLeft(totalDuration);

    await updateDoc(doc(db, "users", userId), {
      miningStartTime: newStartTime
    });
  };

  const minutesLeft = Math.floor(timeLeft / 60);
  const secondsLeft = timeLeft % 60;

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
