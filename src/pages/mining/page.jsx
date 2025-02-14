import { ChevronRight, CirclePlus, X, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import DailyCheckin from "../../components/dailycheckin";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../../firebase";
import { toast } from "react-toastify";

const db = getFirestore(app);
const auth = getAuth(app);

const Mining = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tasks, setTasks] = useState({
    youtube: { link: "https://youtube.com/@sincoins", claimed: false, timer: 0 },
    telegram: { link: "https://t.me/sin_coin1", claimed: false, timer: 0 },
    twitter: { link: "https://x.com/Sin_Coin1", claimed: false, timer: 0 }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserData(user.uid);
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    if (!uid) {
      setIsLoading(false);
      return;
    }

    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startTaskTimer = (taskName) => {
    if (tasks[taskName].claimed) return;

    setTasks((prev) => ({
      ...prev,
      [taskName]: { ...prev[taskName], timer: 120 }
    }));

    const interval = setInterval(() => {
      setTasks((prev) => {
        if (prev[taskName].timer <= 1) {
          clearInterval(interval);
          completeTask(taskName);
          return { ...prev, [taskName]: { ...prev[taskName], timer: 0, claimed: true } };
        }
        return { ...prev, [taskName]: { ...prev[taskName], timer: prev[taskName].timer - 1 } };
      });
    }, 1000);
  };

  const completeTask = async (taskName) => {
    if (!userId) return;

    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, { balance: (userSnap.data().balance || 0) + 180 });
        toast.success(`✅ +180 Sincoins added for ${taskName}`);
      }
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  const openPopup = () => {
    setIsOpen(true);
  };

  const handleCopyReferral = () => {
    const referralCode = userId;
    navigator.clipboard.writeText(`${window.location.origin}/#/register?ref=${referralCode}`);
    toast.success("Referral link copied!");
  };

  return (
    <>
      <main className="w-full flex h-[80vh] overflow-y-scroll flex-col gap-[17px] relative">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-75"></div>
          </div>
        ) : (
          <>
            {/* Daily Task Card */}
            <div
              className="flex bg-white rounded-lg w-full h-fit items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100 transition"
              onClick={openPopup}
            >
              <img
                className="w-14 rounded-full"
                src="https://i.pinimg.com/736x/c4/1c/5c/c41c5cc63b37ac8929ad764295d946fc.jpg"
                alt="Daily Task Icon"
              />
              <span className="flex flex-col flex-grow pl-4 pr-2">
                <h2 className="text-lg font-semibold">Daily Task</h2>
                <p className="text-sm text-gray-600">Daily earnings 🥳🥳</p>
              </span>
              <ChevronRight className="text-2xl" />
            </div>

            {/* Referral Section */}
            <div className="flex flex-col bg-white rounded-lg w-full p-4">
              <h2 className="text-lg font-semibold mb-2">🎁 Referral Rewards</h2>
              <p className="text-sm text-gray-600">
                Invite friends and earn <span className="font-bold">500 coins</span> for every successful signup!
              </p>
              <div className="flex items-center mt-3 bg-gray-100 rounded-lg p-3">
                <span className="text-sm text-gray-800 flex-grow truncate">
                  {`${window.location.origin}/#/register?ref=${userId}`}
                </span>
                <button
                  className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center hover:bg-blue-600"
                  onClick={handleCopyReferral}
                >
                  <Copy size={18} className="mr-1" />
                  Copy
                </button>
              </div>
            </div>

            <DailyCheckin />

            {/* Social Media Tasks Popup */}
            {isOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.64)] px-[10px] bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative max-h-[80vh] overflow-y-auto">
                  <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
                    onClick={() => setIsOpen(false)}
                  >
                    <X size={24} />
                  </button>
                  <h2 className="text-2xl font-semibold mb-4">Task Details</h2>
                  {Object.entries(tasks).map(([taskName, task], index) => (
                    <div
                      key={index}
                      className="flex bg-slate-200 mb-4 rounded-lg w-full h-fit items-center justify-center px-[15px] py-[10px] cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => {
                        if (!task.claimed) {
                          window.open(task.link, "_blank");
                          startTaskTimer(taskName);
                        }
                      }}
                    >
                      <h2 className="text-[20px]">{taskName.charAt(0).toUpperCase() + taskName.slice(1)}</h2>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default Mining;
