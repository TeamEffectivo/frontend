import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import curriculumData from '../data/curriculum.json';
import type { Curriculum, Challenge } from '../types';
import { X } from 'lucide-react';

const curriculum = curriculumData as unknown as Curriculum;

export default function GameScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const { deductBattery, batteries, addCoin } = useUserStore();

  const lesson = curriculum.lessons.find(l => l.id === id);
  if (!lesson) return <div>Lesson Not Found</div>;

  const challenge: Challenge = lesson.challenges[step];

  const handleAnswer = (userAnswer: string) => {
    if (userAnswer.toLowerCase() === challenge.answer.toLowerCase()) {
      if (step < lesson.challenges.length - 1) {
        setStep(step + 1);
        addCoin(5);
      } else {
        alert("Lesson Complete! +50 Coins");
        addCoin(50);
        navigate('/');
      }
    } else {
      deductBattery();
      if (batteries <= 1) {
        alert("Out of batteries! Buy more in the shop.");
        navigate('/');
      } else {
        alert("Try again!");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center gap-6 max-w-4xl mx-auto w-full">
        <button onClick={() => navigate('/')}><X size={32} className="text-gray-400" /></button>
        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-500" 
            style={{ width: `${((step + 1) / lesson.challenges.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <h2 className="text-4xl font-bold mb-12 text-center">{challenge.question}</h2>

        {/* MULTIPLE CHOICE TYPE */}
        {challenge.type === 'MULTIPLE_CHOICE' && challenge.options && (
          <div className="grid grid-cols-2 gap-4 w-full">
            {challenge.options.map(opt => (
              <button 
                key={opt}
                onClick={() => handleAnswer(opt)}
                className="p-8 border-2 border-gray-200 rounded-2xl hover:bg-blue-50 hover:border-blue-400 active:bg-blue-100 font-bold text-2xl transition-all shadow-sm"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* FILL IN THE BLANK TYPE */}
        {challenge.type === 'FILL_BLANK' && (
          <div className="flex flex-col items-center gap-8">
            <p className="text-6xl font-mono tracking-widest">{challenge.text}</p>
            <input 
              autoFocus
              className="w-24 h-24 text-center text-4xl border-4 border-blue-500 rounded-3xl outline-none"
              onChange={(e) => {
                if(e.target.value.length === 1) handleAnswer(e.target.value);
                e.target.value = ""; // Reset for next use
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}