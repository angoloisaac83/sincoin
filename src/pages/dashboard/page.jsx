import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../../firebase'; // Import Firebase config
import ProgressBar from '../../components/progressbar';
import { Loader } from 'lucide-react';

const auth = getAuth(app);
const db = getFirestore(app);

const Dashboard = () => {
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
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  return (
    <div className="bg-slate-200 h-screen">
      <div className="">
        {loading ? (
          <Loader />
        ) : userData ? (
          <>
            <main className='flex items-center justify-between h-screen flex-col'>
              <div className='w-full h-[90%] pb-[160px] gap-[40px] flex flex-col justify-center items-center'>
                <h1 class="text-5xl font-bold gradient-text">SinCoin</h1>
                <div className='loader'></div>
                <div className='w-full h-fit gap-[6px] flex flex-col items-center justify-center'>
                  <span className='text-3xl'>
                    Minned Balance: {userData.balance}
                  </span>
                  <h1 className='capitalize text-2xl'>mining power: {userData.miningpower}/hour</h1>
                  <ProgressBar />
                </div>
              </div>
            </main>
            
          </>
        ) : (
          <p>No user data found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
