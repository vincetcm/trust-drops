import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import VerificationPage from './pages/VerificationPage.jsx';
// import { LogInWithAnonAadhaar, useAnonAadhaar } from 'anon-aadhaar-react';
import { useNavigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { useEffect } from 'react';
import Airdrop from './pages/Airdrop.jsx';
import LeaderBoard from './pages/LeaderBoard.jsx';

function App() {
  const navigate = useNavigate();
  // const [anonAadhaar] = useAnonAadhaar();

  let retriveItem = JSON.parse(localStorage.getItem('status'));
  useEffect(() => {
    // console.log('useAnonAadhaar?.status', useAnonAadhaar?.status);
    // if (anonAadhaar?.status === 'logged-out') {
    //   navigate('/verification');
    // } else if (anonAadhaar?.status === 'logged-in') {
    //   navigate('/dashboard');
    // }
  }, []);
  return (
    <div className='App h-screen bg-black '>
      <DataProvider>
        {/* <Router> */}
        <Navbar />
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/staking' element={<Dashboard />} />
          <Route path='/leaderboard' element={<LeaderBoard />} />
          <Route path='/airdrop' element={<Airdrop />} />
        </Routes>
        {/* </Router> */}
      </DataProvider>
    </div>
  );
}

export default App;
