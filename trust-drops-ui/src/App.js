import {
  Routes,
  Route,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import { DataProvider } from './context/DataContext';
import Airdrop from './pages/Airdrop.jsx';
import LeaderBoard from './pages/LeaderBoard.jsx';
import { AnimatePresence } from 'framer-motion';

function App() {
  return (
    <div className='App h-screen  bg-black '>
      <DataProvider>
        <Navbar />
        <AnimatePresence>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/staking' element={<Dashboard />} />
            <Route path='/leaderboard' element={<LeaderBoard />} />
            <Route path='/airdrop' element={<Airdrop />} />
          </Routes>
        </AnimatePresence>
      </DataProvider>
    </div>
  );
}

export default App;
