import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../../../firebase'; // Your Firebase config file
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion'; // Import motion
// import { Loader } from 'lucide-react';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    try {
      await signInWithEmailAndPassword(auth, email, password);
      sessionStorage.setItem('userEmail', email);
      toast.success('Login successful!');
      window.location.href = "/#/dashboard";
    } catch (error) {
      toast.error('Error logging in: ' + error.message);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true); // Set loading to true
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      sessionStorage.setItem('userEmail', user.email);
      toast.success('Google login successful!');
      window.location.href = "/#/dashboard";
    } catch (error) {
      toast.error('Error with Google login: ' + error.message);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-[50px] min-h-screen bg-white px-[30px]">
      <motion.div 
        className='w-[100%] p-[6px] h-[60px] bg-gray-100 flex rounded-full items-center justify-between' 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <Link className="bg-transparent w-[50%] flex items-center justify-center text-black rounded-full text-center h-full" to="/register">
          <span className="bg-transparent w-[50%] flex items-center justify-center text-black rounded-full text-center h-full">Register</span>
        </Link>
        <span className="bg-[#F5D02A] w-[50%] flex items-center justify-center text-black rounded-full text-center h-full">Log In</span>
      </motion.div>
        <motion.form 
          onSubmit={handleSubmit} 
          className='w-full' 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full pl-4 py-[15px] border border-gray-300 rounded-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 block pl-4 w-full py-[15px] border border-gray-300 rounded-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='text-xl font-light flex items-center py-[15px] justify-center gap-2 w-fit'>
            <input type="checkbox" name="" className='mt-0 p-2 w-[20px] h-[20px]' id="" />
            <p>Remember me...</p>
          </div>
          <div className="flex flex-col justify-between py-[17px]">
            <button type="button" className="text-black bg-white gap-4 border-1 border-gray-800 py-[15px] flex items-center justify-center rounded-full hover:underline" onClick={handleGoogleSignIn}>
              <img
                className='w-[30px]'
                src="https://i.pinimg.com/736x/c8/b8/12/c8b8129127bada9fa699aeba388b3b2b.jpg" alt="" />
              Sign In with Google
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-[#F5D02A] text-white px-[10px] py-[15px] rounded-full hover:bg-green-700 flex items-center justify-center gap-2"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Loading........" : "Log In"}
          </button>

        </motion.form>
    </div>
  );
};

export default Login;