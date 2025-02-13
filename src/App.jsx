import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Onboarding from './pages/onboarding/page';
import Register from './pages/register/page';
import Login from './pages/login/page';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Mining from './pages/mining/page';
import Layout from './pages/layout';
import TicTacToe from './components/Game.jsx';
import Dashboard from './pages/dashboard/page';
import Profile from './pages/profile/page';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Onboarding />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes inside Layout */}
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/game"
            element={
              <Layout>
                <TicTacToe />
              </Layout>
            }
          />
          <Route
            path="/mining"
            element={
              <Layout>
                <Mining />
              </Layout>
            }
          />
        </Routes>
      </div>
      <ToastContainer />
    </Router>
  );
};

export default App;
