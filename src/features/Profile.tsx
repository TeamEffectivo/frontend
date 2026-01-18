import { useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { User, Mail, Trophy, Coins, BatteryFull, Snowflake } from 'lucide-react';

const Profile = () => {
  const { coins, batteries, streak, streakFreezes } = useUserStore();
  // Initialize state directly from localStorage using function initializer
  const [userEmail] = useState<string>(() => localStorage.getItem('userEmail') || '');
  const [userName] = useState<string>(() => localStorage.getItem('userName') || 'User');

  // Calculate total score (coins + streak points)
  const totalScore = coins + (streak * 10);

  return (
    <div className="pt-24 px-8 pb-12 max-w-4xl mx-auto">

      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-800 mb-4">Profile</h1>
      </header>


      <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-lg mb-6">
        <div className="flex flex-col items-center mb-6">

          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4 shadow-lg border-4 border-white">
            <User size={64} className="text-white" />
          </div>
          

          <h2 className="text-3xl font-black text-slate-800 mb-2">{userName}</h2>
          

          <div className="flex items-center gap-2 text-slate-600">
            <Mail size={18} />
            <span className="text-lg">{userEmail || 'user@example.com'}</span>
          </div>
        </div>
      </div>

      {/* Score Card */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-3xl p-8 shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Trophy size={32} className="text-white" />
            </div>
            <div>
              <p className="text-slate-600 font-bold text-sm uppercase tracking-wider mb-1">Total Score</p>
              <p className="text-4xl font-black text-slate-800">{totalScore.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coins */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-lg hover:border-yellow-300 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Coins size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Coins</p>
              <p className="text-2xl font-black text-slate-800">{coins}</p>
            </div>
          </div>
        </div>

        {/* Batteries */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-lg hover:border-red-300 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <BatteryFull size={24} className="text-red-600" />
            </div>
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Batteries</p>
              <p className="text-2xl font-black text-slate-800">{batteries}</p>
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-lg hover:border-blue-300 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Snowflake size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Streak</p>
              <p className="text-2xl font-black text-slate-800">{streak} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Card */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-lg mt-6">
        <h3 className="text-xl font-black text-slate-800 mb-4">Additional Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Streak Freezes</p>
            <p className="text-xl font-black text-slate-800">{streakFreezes}</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4">
            <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Streak Points</p>
            <p className="text-xl font-black text-slate-800">{streak * 10}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
