import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MapScreen from './features/MapScreen';
import GameScreen from './features/GameScreen';
import ShopScreen from './features/ShopScreen';
import LettersScreen from './features/LettersScreen';
import CalendarScreen from './features/CalendarScreen';
import AuthPage from './features/AuthPage';
import Profile from './features/Profile';
import Sidebar from './Components/SideBar';


function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/';

  return (
    <div className="flex min-h-screen bg-slate-50">
      {!isAuthPage && <Sidebar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/map" element={<MapScreen />} />
          <Route path="/lesson/:id" element={<GameScreen />} />
          <Route path="/shop" element={<ShopScreen />} />
          <Route path="/letters" element={<LettersScreen />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/calendar' element={<CalendarScreen />}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;