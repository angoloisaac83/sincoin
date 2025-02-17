import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../../firebase'; // Import Firebase config
import ProgressBar from '../../components/progressbar';
import logo from '../../assets/logo.jpg'
import { Loader } from 'lucide-react';

const auth = getAuth(app);
const db = getFirestore(app);

export const formatBalance = (balance) => {
    return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

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
    <div className="bg-[#172228] h-screen">
      <div className="">
        {loading ? (
          <Loader />
        ) : userData ? (
          <>
            <main className='flex items-center justify-between h-screen flex-col'>
              <div className='w-full h-[90%] pb-[160px] gap-[40px] flex flex-col justify-center items-center'>
                <h1 className="text-5xl font-bold flex items-center justify-center"><img src={logo} className='w-[50px] h-[50px] object-contain pb-[8px]' alt="" />Crest <span className='text-[#F5D02A]'>Coin</span> </h1>
                {/* <div className='loader'></div> */}
                <div className="hourglassBackground">
                  <div className="hourglassContainer">
                    <div className="hourglassCurves"></div>
                    <div className="hourglassCapTop"></div>
                    <div className="hourglassGlassTop"></div>
                    <div className="hourglassSand"></div>
                    <div className="hourglassSandStream"></div>
                    <div className="hourglassCapBottom"></div>
                    <div className="hourglassGlass"></div>
                  </div>
                </div>
                <div className='w-full h-fit gap-[6px] flex flex-col items-center justify-center'>
                  <span className='text-3xl'>
                    Minned Balance: {formatBalance(userData.balance)}
                  </span>
                  <h1 className='capitalize text-2xl'>mining power: {userData.miningPower}/hour</h1>
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
