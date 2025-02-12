import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase"; // Firebase config
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const db = getFirestore(app);
const auth = getAuth(app);

const DailyCheckin = () => {
  const [claimedDays, setClaimedDays] = useState([]);
  const [currentDay, setCurrentDay] = useState(0);
  const [claimedToday, setClaimedToday] = useState(false);

  useEffect(() => {
    const fetchCheckinData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          const storedClaimedDays = data.claimedDays || [];
          const lastClaimedDate = data.lastClaimed || 0;
          const today = new Date().setHours(0, 0, 0, 0);
          const lastClaimedTime = new Date(lastClaimedDate).setHours(0, 0, 0, 0);

          if (today === lastClaimedTime) {
            setClaimedToday(true);
          }

          const newDay = storedClaimedDays.length % 7; // Reset every 7 days
          setCurrentDay(newDay);
          setClaimedDays(storedClaimedDays);
        }
      }
    };

    fetchCheckinData();
  }, []);

  const claimReward = async () => {
    const user = auth.currentUser;
    if (user && !claimedToday) {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const reward = 100 * Math.pow(2, currentDay);
        const newBalance = (data.balance || 0) + reward;
        const updatedClaimedDays = [...claimedDays, currentDay];

        await updateDoc(userRef, {
          balance: newBalance,
          claimedDays: updatedClaimedDays,
          lastClaimed: Date.now(),
        });

        setClaimedDays(updatedClaimedDays);
        setClaimedToday(true);

        // ✅ Success Toast Notification
        toast.success(`🎉 Successfully claimed ${reward} coins!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">Daily Check-In</h2>

      {/* Calendar View */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className={`p-3 rounded-md font-semibold ${
              claimedDays.includes(index)
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : index === currentDay
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>

      <p className="text-lg">
        Today&apos;s Reward: <span className="font-bold">{100 * Math.pow(2, currentDay)}</span>
      </p>

      <button
        onClick={claimReward}
        disabled={claimedToday}
        className={`mt-4 px-6 py-3 rounded-md text-white font-semibold ${
          claimedToday ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        } transition`}
      >
        {claimedToday ? "Claimed ✅" : "Claim Reward 🎁"}
      </button>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default DailyCheckin;
