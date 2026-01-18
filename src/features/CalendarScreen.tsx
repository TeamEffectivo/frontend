import React from 'react';
import { useUserStore } from '../store/useUserStore';
import { ChevronLeft, ChevronRight, CheckCircle2, Flame, Snowflake, Info } from 'lucide-react';

export default function CalendarScreen() {
  const { streak, streakFreezes } = useUserStore();
  
  // Mocking missed days that were saved by a freeze
  const completedDays = [1, 2, 5, 6, 7, 8]; 
  const frozenDays = [3, 4]; // These days were missed but saved
  const daysInMonth = 31;

  return (
    <div className="pt-24 px-8 pb-12 max-w-4xl mx-auto">
      {/* Streak Freeze Status Bar */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-[2rem] border-2 border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
            <Snowflake size={32} />
          </div>
          <div>
            <h3 className="font-black text-slate-800">Streak Freeze</h3>
            <p className="text-sm text-slate-500">Your streak is protected for {streakFreezes} days.</p>
          </div>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-md active:scale-95">
          Buy More
        </button>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
        <div className="grid grid-cols-7 gap-4">
          {/* Day Labels... */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const isCompleted = completedDays.includes(dayNum);
            const isFrozen = frozenDays.includes(dayNum);
            
            return (
              <div 
                key={i} 
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all border-2
                  ${isCompleted ? 'bg-orange-50 border-orange-200 text-orange-600' : 
                    isFrozen ? 'bg-blue-50 border-blue-200 text-blue-600' : 
                    'bg-slate-50 border-transparent text-slate-400'}`}
              >
                <span className="font-bold">{dayNum}</span>
                {isFrozen && (
                  <Snowflake size={14} className="absolute top-2 right-2 text-blue-400 animate-pulse" />
                )}
                {isCompleted && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-orange-400 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation Tooltip */}
      <div className="mt-6 flex items-center gap-2 text-slate-400 text-sm justify-center">
        <Info size={16} />
        <p>A <span className="text-blue-500 font-bold">Freeze</span> automatically fills in missed days.</p>
      </div>
    </div>
  );
}