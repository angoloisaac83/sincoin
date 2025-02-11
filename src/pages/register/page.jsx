// Register.jsx
import React, { useState } from 'react';
// Import Firebase config and initialize Firestore
// import { getFirestore, doc, setDoc } from 'firebase/firestore';
// import { app } from './firebaseConfig'; // Your Firebase config file

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Uncomment to connect to Firestore
    // const db = getFirestore(app);
    // const userId = email; // or any unique user ID
    // await setDoc(doc(db, 'users', userId), { email, password });

    // Store user details in session storage
    sessionStorage.setItem('userEmail', email);
    // sessionStorage.setItem('userPassword', password); // Avoid storing passwords in session storage
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-[30px]">
      <div className="">
        <div className='w-[100%] p-[6px] h-[60px] bg-gray-100 flex rounded-full items-center justify-between '>
            <span className="bg-green-500 w-[50%] flex items-center justify-center text-black rounded-full text-center h-full">Register</span>
            <span className="bg-transparent w-[50%] flex items-center justify-center text-black rounded-full text-center h-full">Log In</span>
        </div>
        <br />
        <form onSubmit={handleSubmit}>
            <span className='flex py-[5px] items-center justify-center w-full h-fit'>
            <div className="">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-[95%] p-[10px] border border-gray-300 rounded-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-[95%] p-[10px] border border-gray-300 rounded-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
            </span>
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
          <div className="flex flex-col justify-between mb-4">
            <button type="button" className="text-blue-600 hover:underline">Continue with Telegram</button>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-[10px] py-[15px] rounded-full hover:bg-blue-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;