// Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../../../firebase'; // Your Firebase config file
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      sessionStorage.setItem('userEmail', email);
      toast.success('Login successful!');
      window.location.href = "/#/dashboard"
    } catch (error) {
      toast.error('Error logging in: ' + error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      sessionStorage.setItem('userEmail', user.email);
      toast.success('Google login successful!');
    } catch (error) {
      toast.error('Error with Google login: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-[30px]">
        <div className='w-[100%] p-[6px] h-[60px] bg-gray-100 flex rounded-full items-center justify-between '>
            <Link className="bg-transparent w-[50%] flex items-center justify-center text-black rounded-full text-center h-full" to="/register">
              <span className="bg-transparent w-[50%] flex items-center justify-center text-black rounded-full text-center h-full">Register</span>
            </Link>
            <span className="bg-green-500 w-[50%] flex items-center justify-center text-black rounded-full text-center h-full">Log In</span>
        </div>
        <br />
        <form onSubmit={handleSubmit} className='w-full'>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full p-[10px] border border-gray-300 rounded-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full p-[10px] border border-gray-300 rounded-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='text-xl flex items-center py-[15px] justify-center gap-2 w-fit'>
            <input type="checkbox" name="" id="" />
            <p>Remember me...</p>
          </div>
          <div className="flex flex-col justify-between py-[17px]">
            <button type="button" className="text-black bg-white gap-4 border-1 border-gray-800 py-2 flex items-center justify-center rounded-full hover:underline" onClick={handleGoogleSignIn}>
              <img
              className='w-[30px]'
               src="https://i.pinimg.com/736x/c8/b8/12/c8b8129127bada9fa699aeba388b3b2b.jpg" alt="" />
              Sign In with Google
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-[10px] py-[15px] rounded-full hover:bg-green-700"
          >
            Log In
          </button>
        </form>
    </div>
  );
};

export default Login;
