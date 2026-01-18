import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Components/SideBar';
import MapScreen from './features/MapScreen';
import GameScreen from './features/GameScreen';
import ShopScreen from './features/ShopScreen';
import LettersScreen from './features/LettersScreen';
import CalendarScreen from './features/CalendarScreen';
import { LoginPage } from './features/LogIn';
import { VerifyPage } from './features/VeriftPage';

// Simple placeholder for missing routes to ensure something renders
const Placeholder = ({ name }: { name: string }) => (
  <div className="p-10">
    <h1 className="text-2xl font-bold">{name} Screen</h1>
    <p className="text-gray-500">Coming soon...</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/Map" element={<MapScreen />} />
            <Route path="/lesson/:id" element={<GameScreen />} />
            <Route path="/shop" element={<ShopScreen />} />
            <Route path="/letters" element={<LettersScreen />} />
            <Route path="/profile" element={<Placeholder name="User Profile" />} />
            <Route path="/settings" element={<Placeholder name="Settings" />} />
            <Route path='/calendar' element={<CalendarScreen />}/>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;