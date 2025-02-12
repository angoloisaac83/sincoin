import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../firebase'; // Import Firebase config
import Navbar from '../components/navbar';
import FloatingTaskbar from '../components/taskbar';
import { Loader } from 'lucide-react';

const auth = getAuth(app);
const db = getFirestore(app);

const Layout = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data()); // Store user data
          } else {
            console.log('User data not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null); // No user logged in
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  return (
    <div className="bg-slate-200 min-h-screen flex flex-col">
      {loading ? (
        // Loader centered on the page
        <div className="flex items-center justify-center h-screen">
          <Loader className="animate-spin text-gray-600 w-12 h-12" />
        </div>
      ) : userData ? (
        <>
          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <main className="flex flex-col h-screen overflow-y-scroll flex-grow items-center justify-between w-full px-4 py-6">
            {children} {/* 👈 This allows dynamic content inside Layout */}
          </main>

          {/* Floating Taskbar */}
          <FloatingTaskbar />
        </>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600 text-lg">No user data found.</p>
        </div>
      )}
    </div>
  );
};

export default Layout;
