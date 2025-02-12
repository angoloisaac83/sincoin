import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../firebase";

const db = getFirestore(app);
const auth = getAuth(app);

const ProgressBar = () => {
  const totalDuration = 3600; // Reduced for testing (Change back to 3600 for 1 hour)

  const [progress, setProgress] = useState(0);
  const [miningPower, setMiningPower] = useState(0);
  const [miningValue, setMiningValue] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Ensure auth is loaded properly
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
    }
  };

  useEffect(() => {
    let interval;

    if (isMining) {
      let startTime = sessionStorage.getItem("miningStartTime");
      if (!startTime) {
        startTime = Date.now().toString();
        sessionStorage.setItem("miningStartTime", startTime);
      } else {
        startTime = parseInt(startTime);
      }

      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000; // in seconds
        const newProgress = (elapsed / totalDuration) * 100;

        if (newProgress >= 100) {
          clearInterval(interval);
          completeMining();
        } else {
          setProgress(newProgress);
          sessionStorage.setItem("miningProgress", newProgress.toString());
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isMining]);

  const completeMining = async () => {
    setIsMining(false);
    setProgress(100);

    if (!userId) return;

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      const pows = miningPower * miningValue;
      alert(pows)
      const newBalance = (data.balance || 0) + pows;

      try {
        await updateDoc(userRef, { balance: newBalance });
        console.log("Balance updated:", newBalance);
      } catch (error) {
        console.error("Failed to update balance:", error);
      }
    }

    sessionStorage.removeItem("miningProgress");
    sessionStorage.removeItem("miningStartTime");
  };

  const startMining = () => {
    setProgress(0);
    setIsMining(true);
    sessionStorage.setItem("miningProgress", "0");
    sessionStorage.setItem("miningStartTime", Date.now().toString());
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
