import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../firebase';
import { UserCircle } from 'lucide-react';

const auth = getAuth(app);
const db = getFirestore(app);

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.log('User data not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="flex w-full shadow-md h-16 px-6 bg-[#172228] text-white items-center justify-between">
      <div className="flex items-center gap-3">
        <UserCircle className="w-8 h-8 text-white" />
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : userData ? (
          <h1 className="text-lg font-semibold text-white">Welcome, {userData.firstName}!</h1>
        ) : (
          <p className="text-gray-500">No user data found.</p>
        )}
      </div>
      {userData && <p className="text-md font-medium text-white">Level: {userData.level}</p>}
    </nav>
  );
};

export default Navbar;
