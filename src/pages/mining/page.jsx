import { ChevronRight, CirclePlus, X, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import DailyCheckin from "../../components/dailycheckin";
import { getFirestore, doc, getDoc } from "firebase/firestore";
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

  const openPopup = (content) => {
    setPopupContent(content);
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
              onClick={() => openPopup("Complete your daily tasks to earn rewards!")}
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

            {/* Mining Power Card */}
            <div
              className="flex bg-white rounded-lg w-full h-fit items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => openPopup("Increase your mining power to earn more!")}
            >
              <img
                className="w-14 rounded-full"
                src="https://i.pinimg.com/736x/c4/1c/5c/c41c5cc63b37ac8929ad764295d946fc.jpg"
                alt="Mining Power Icon"
              />
              <span className="flex flex-col flex-grow pl-4 pr-2">
                <h2 className="text-lg font-semibold">Mining Power</h2>
                <p className="text-sm text-gray-600">Boost your earnings ⚡</p>
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

            {/* Popup Modal */}
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
                  <p className="text-gray-700 pb-4">{popupContent}</p>

                  {/* Social Media Subscription Tasks */}
                  {[
                    {
                      title: "YouTube",
                      desc: "Subscribe to our channel⚡+180",
                      img: "https://i.pinimg.com/736x/9a/e8/5e/9ae85eaa9cea5decea8817bd8fcf650b.jpg"
                    },
                    {
                      title: "Telegram",
                      desc: "Join our channel⚡+180",
                      img: "https://i.pinimg.com/736x/20/35/96/20359662fcd835fa8637bdee18ad6697.jpg"
                    },
                    {
                      title: "X (Twitter)",
                      desc: "Follow us on X⚡+180",
                      img: "https://i.pinimg.com/736x/c8/d3/d4/c8d3d4d12a8ea35b58e35de9ec820a22.jpg"
                    }
                  ].map((task, index) => (
                    <div
                      key={index}
                      className="flex bg-slate-200 mb-4 rounded-lg w-full h-fit items-center justify-center px-[15px] py-[10px] cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => openPopup(task.desc)}
                    >
                      <img className="w-[50px] rounded-full" src={task.img} alt={task.title} />
                      <span className="flex flex-col pr-[50px] pl-3">
                        <h2 className="text-[20px]">{task.title}</h2>
                        <p>{task.desc}</p>
                      </span>
                      <CirclePlus className="text-4xl" />
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
