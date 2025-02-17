import { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../../../firebase"; // Firebase config
import { useNavigate } from "react-router-dom";
import { LogOut, UserCircle, Copy } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const auth = getAuth(app);
const db = getFirestore(app);

export const formatBalance = (balance) => {
    return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [referredUsers, setReferredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserData(user.uid);
        fetchReferredUsers(user.uid);
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

  const fetchReferredUsers = async (uid) => {
    if (!uid) return;

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("referredBy", "==", uid));
      const querySnapshot = await getDocs(q);

      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });

      setReferredUsers(users);
    } catch (error) {
      console.error("Error fetching referred users:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("✅ Logged out successfully!");
    navigate("/login");
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/#/register?ref=${userId}`;
    navigator.clipboard.writeText(referralLink);
    toast.success("✅ Referral link copied!");
  };

  return (
    <div className="w-full h-[80vh] overflow-y-scroll mx-auto bg-[rgba(0,0,0,0.34)] shadow-lg rounded-lg p-6 text-center">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-75"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-center">
            <UserCircle size={80} className="text-gray-500" />
          </div>
          <h2 className="text-2xl font-semibold mt-4 capitalize">
            {userData?.firstName || "User"} {userData?.lastName || "User"}
          </h2>
          <p className="text-gray-600">{auth.currentUser?.email}</p>

          <div className="mt-6 p-4 flex gap-3 items-center justify-center bg-[rgba(0,0,0,0.34)] rounded-lg">
            <p className="text-lg font-semibold">CrestCoin Balance:</p>
            <p className="text-2xl font-bold text-[#F5D02A]">
            {formatBalance(userData?.balance || 0)} Coins
            </p>
          </div>

          {/* 🔗 Referral Section */}
          <div className="mt-6 p-4 bg-[rgba(0,0,0,0.34)] rounded-lg text-left">
            <h3 className="text-lg font-semibold">Your Referral Link</h3>
            <div className="flex items-center mt-2 bg-white p-2 rounded-lg border">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/#/register?ref=${userId}`}
                className="w-full text-gray-700 outline-none"
              />
              <button onClick={copyReferralLink} className="ml-2 text-blue-500 hover:text-blue-700">
                <Copy size={20} />
              </button>
            </div>
          </div>

          {/* 👥 Referred Users Section */}
          <div className="mt-6 p-4 overflow-y-scroll bg-[rgba(0,0,0,0.34)] rounded-lg text-left">
            <h3 className="text-lg font-semibold">Referred Users</h3>
            {referredUsers.length > 0 ? (
              <ul className="mt-2">
                {referredUsers.map((user, index) => (
                  <li key={index} className="bg-[rgba(0,0,0,0.34)] p-2 rounded-lg mb-2">
                    {user.firstName || "User"} {user.lastName || ""}
                    <span className="text-gray-500 text-sm"> ({user.email})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mt-2">No referred users yet.</p>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 bg-red-500 mx-auto text-white px-6 py-3 rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-red-600 transition"
          >
            <LogOut size={20} /> Logout
          </button>
        </>
      )}

      <ToastContainer />
    </div>
  );
};

export default Profile;
