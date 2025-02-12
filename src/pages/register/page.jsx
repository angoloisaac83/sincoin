import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { app } from '../../../firebase'; // Firebase config
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState(1);
  const [balance, setBalance] = useState(10);
  const [miningValue, setMiningValue] = useState(2);
  const [miningPower, setMiningPower] = useState(100);
  const [referredBy, setReferredBy] = useState(null);

  const location = useLocation();
  useEffect(() => {
    // Get referral code from URL (e.g., ?ref=USER_ID)
    const params = new URLSearchParams(location.search);
    const referrerId = params.get('ref');

    if (referrerId) {
      setReferredBy(referrerId);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        firstName,
        lastName,
        email,
        level,
        balance,
        miningPower,
        miningValue,
        referredBy, // Store referrer ID
        createdAt: new Date(),
      };

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), userData);

      // If referredBy exists, update referrer's balance & add referral
      if (referredBy) {
        const referrerRef = doc(db, 'users', referredBy);
        const referrerSnap = await getDoc(referrerRef);

        if (referrerSnap.exists()) {
          const referrerData = referrerSnap.data();

          await updateDoc(referrerRef, {
            balance: (referrerData.balance || 0) + 500, // Reward referrer
            referrals: [...(referrerData.referrals || []), user.uid], // Store referred users
          });
        }
      }

      sessionStorage.setItem('userEmail', email);
      toast.success('🎉 Registration successful!');
      window.location.href = "/#/login";
    } catch (error) {
      toast.error('❌ Error registering: ' + error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userData = {
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
        email: user.email,
        referredBy, // Store referrer ID if exists
        createdAt: new Date(),
      };

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });

      // Handle referral rewards for Google Sign-In
      if (referredBy) {
        const referrerRef = doc(db, 'users', referredBy);
        const referrerSnap = await getDoc(referrerRef);

        if (referrerSnap.exists()) {
          const referrerData = referrerSnap.data();

          await updateDoc(referrerRef, {
            balance: (referrerData.balance || 0) + 500, // Reward referrer
            referrals: [...(referrerData.referrals || []), user.uid], // Store referred users
          });
        }
      }

      sessionStorage.setItem('userEmail', user.email);
      toast.success('🎉 Google registration successful!');
      window.location.href = "/#/login";
    } catch (error) {
      toast.error('❌ Error with Google registration: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      <div className='w-full p-2 h-16 bg-gray-100 flex rounded-full items-center justify-between '>
        <span className="bg-green-500 w-1/2 flex items-center justify-center text-black rounded-full text-center h-full">Register</span>
        <Link className="bg-transparent w-1/2 flex items-center justify-center text-black rounded-full text-center h-full" to="/login">Log In</Link>
      </div>
      <br />
      <form onSubmit={handleSubmit} className='w-full'>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-full"
            value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input type="text" required className="mt-1 block w-full p-2 border border-gray-300 rounded-full"
            value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" required className="mt-1 block w-full p-2 border border-gray-300 rounded-full"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" required className="mt-1 block w-full p-2 border border-gray-300 rounded-full"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {/* Referral Section */}
        {referredBy && (
          <p className="text-green-600 mx-auto ml-[20%] text-sm mb-4">You&apos;re signing up with a referral! 🎉</p>
        )}

        <div className="flex flex-col justify-between mb-4">
          <button type="button" className="text-black bg-white gap-4 border-1 border-gray-800 py-2 flex items-center justify-center rounded-full hover:underline" onClick={handleGoogleSignIn}>
            <img className='w-[30px]' src="https://i.pinimg.com/736x/c8/b8/12/c8b8129127bada9fa699aeba388b3b2b.jpg" alt="Google" />
            Continue with Google
          </button>
        </div>

        <button type="submit" className="w-full bg-green-600 text-white px-4 py-3 rounded-full hover:bg-green-700">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
