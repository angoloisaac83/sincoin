// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Onboarding from './pages/onboarding/page';
import Register from './pages/register/page';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Define routes without using Switch */}
          <Route path="/" element={<Onboarding />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;