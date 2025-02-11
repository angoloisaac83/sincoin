import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../../firebase"; // Firebase config
import { useNavigate } from "react-router-dom";
import { LogOut, UserCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const auth = getAuth(app);
const db = getFirestore(app);

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("✅ Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="w-full mx-auto mt-10 bg-white shadow-lg rounded-lg p-6 text-center">
      <div className="flex justify-center">
        <UserCircle size={80} className="text-gray-500" />
      </div>
      <h2 className="text-2xl font-semibold mt-4 capitalize">{userData?.firstName || "User"} {userData?.lastName || "User"}</h2>
      <p className="text-gray-600">{auth.currentUser?.email}</p>

      <div className="mt-6 p-4 flex gap-3 items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-lg font-semibold">Balance:</p>
        <p className="text-2xl font-bold text-green-600">{userData?.balance || 0} Coins</p>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 mx-auto text-white px-6 py-3 rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-red-600 transition"
      >
        <LogOut size={20} /> Logout
      </button>

      <ToastContainer />
    </div>
  );
};

export default Profile;
