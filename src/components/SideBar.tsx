import { Map, Book, ShoppingCart, User, Calendar, Settings, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useState, useEffect } from 'react';

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
}

const NavItem = ({ to, icon: Icon, label, active }: NavItemProps) => (
  <Link 
    to={to} 
    className={`flex flex-col items-center px-6 py-2 rounded-xl transition-colors ${
      active ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
    }`}
  >
    <Icon size={24} />
    <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">{label}</span>
  </Link>
);

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // Check if user is logged in by checking for idToken in localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("idToken"));

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("idToken");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  useEffect(() => {
    // Check if user is logged in by checking for idToken in localStorage
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("idToken"));
    };
    
    // Check on mount and when pathname changes (user navigates)
    checkLoginStatus();
    
    // Listen for storage events (when user logs in/out in another tab)
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, [pathname]);

  return (
      <div className="flex flex-col items-center gap-2">
        <NavItem to="/map" icon={Map} label="MAP" active={pathname === '/'} />
        <NavItem to="/letters" icon={Book} label="LETTERS" active={pathname === '/letters'} />
        <NavItem to="/shop" icon={ShoppingCart} label="SHOP" active={pathname === '/shop'} />
        <NavItem to="/profile" icon={User} label="PROFILE" active={pathname === '/profile'} />
        <NavItem to="/calendar" icon={Calendar} label="CALENDAR" active={pathname === '/calendar'} />
        <NavItem to="/settings" icon={Settings} label="SETTINGS" active={pathname === '/settings'} />
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="flex flex-col items-center px-6 py-2 rounded-xl transition-colors text-red-500 hover:bg-red-100"
          >
            <LogOut size={24} />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">LOGOUT</span>
          </button>
        )}
      </div>
  );
}