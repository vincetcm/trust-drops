import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import VerificationPage from './pages/VerificationPage';

function App() {
  return (
    <div className='App '>
      <Navbar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/verification' element={<VerificationPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
