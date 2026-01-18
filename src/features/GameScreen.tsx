import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import curriculumData from '../data/curriculum.json';
import { MultipleChoice } from './gameplay/MultipleChoice';
import { SignInterpreter } from './gameplay/SignInterpreter';
import { FillBlank } from './gameplay/FillBlank';
import { Reference } from '../components/Reference';
import { X, ChevronRight, AlertCircle } from 'lucide-react';
import type { Curriculum } from '../types';

const curriculum = curriculumData as unknown as Curriculum;

export default function GameScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showNext, setShowNext] = useState(false);

  const { deductBattery, batteries, addCoin } = useUserStore();

  const lesson = curriculum.lessons.find(l => l.id === id);
  if (!lesson) return <div>Lesson Not Found</div>;
  const challenge = lesson.challenges[step];

  // Clean state when step changes
  useEffect(() => {
    setAttempts(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowNext(false);
  }, [step]);

  const handleAnswer = (userAnswer: string) => {
    if (showNext) return;
    
    const correct = userAnswer.toLowerCase() === challenge.answer.toLowerCase();
    setSelectedOption(userAnswer);
    setIsCorrect(correct);

    if (correct) {
      addCoin(5);
      setShowNext(true);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      deductBattery();
      if (batteries <= 1) return navigate('/shop');
      if (newAttempts >= 3) setShowNext(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col font-sans overflow-hidden">
      <Header progress={((step + 1) / lesson.challenges.length) * 100} onExit={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto pb-32 flex flex-col items-center p-6">
        <h2 className="text-3xl font-black mb-8 text-center text-slate-800">
          {challenge.question}
        </h2>

        <div className="w-full max-w-2xl">
            {challenge.type === 'TUTORIAL' && (
                <div className="grid md:grid-cols-2 gap-8 items-center animate-in fade-in zoom-in-95 duration-500">
                    <Reference sign={challenge.answer} />
                    <SignInterpreter 
                        expectedAnswer={challenge.answer} 
                        onSuccess={() => handleAnswer(challenge.answer)}
                        onFailure={() => handleAnswer("WRONG_GESTURE")} 
                    />
                </div>
            )}
            {challenge.type === 'MULTIPLE_CHOICE' && (
            <MultipleChoice 
                challenge={challenge} 
                onAnswer={handleAnswer} 
                selectedOption={selectedOption}
                isCorrect={isCorrect}
                showNext={showNext}
            />
            )}

            {challenge.type === "SIGN_RECOGNITION" && (
            <SignInterpreter 
                expectedAnswer={challenge.answer} 
                onSuccess={() => handleAnswer(challenge.answer)}
                onFailure={() => handleAnswer("WRONG_GESTURE")} 
            /> 
            )}

            {challenge.type === 'FILL_BLANK' && (
            <FillBlank challenge={challenge} onAnswer={handleAnswer} showNext={showNext} />
            )}
        </div>

        <FeedbackArea isCorrect={isCorrect} selectedOption={selectedOption} attempts={attempts} answer={challenge.answer} />
      </div>

      <Footer 
        showNext={showNext} 
        isCorrect={isCorrect} 
        onNext={() => {
            if (step < lesson.challenges.length - 1) {
                setStep(s => s + 1);
            } else {
                
                if (parseInt(lesson.id) > parseInt(localStorage.getItem(`palmo_user_progress`)!)) {
                  localStorage.setItem(`palmo_user_progress`, lesson.id)
                  addCoin(50);
                }
                navigate('/map');
            }
        }} 
      />
    </div>
  );
}

const Header = ({ progress, onExit }: any) => (
  <div className="p-6 flex items-center gap-6 w-full max-w-4xl mx-auto">
    <button onClick={onExit} className="hover:scale-110 transition-transform">
        <X size={32} className="text-gray-400" />
    </button>
    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
      <div className="h-full bg-green-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
    </div>
  </div>
);

const FeedbackArea = ({ isCorrect, selectedOption, attempts, answer }: any) => (
  <div className="h-24 mt-4 flex flex-col items-center justify-center text-center">
    {!isCorrect && selectedOption && attempts < 3 && (
      <div className="flex items-center gap-2 text-red-500 font-black animate-bounce">
        <AlertCircle size={24} />
        <span>Try again! ({3 - attempts} lives left)</span>
      </div>
    )}
    {attempts >= 3 && !isCorrect && (
      <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-100">
        <p className="text-red-500 font-bold text-xs uppercase tracking-widest">Out of attempts</p>
        <p className="text-slate-800 font-black text-xl">Correct Answer: <span className="text-green-600">{answer}</span></p>
      </div>
    )}
  </div>
);

const Footer = ({ showNext, isCorrect, onNext }: any) => (
  <div className={`fixed bottom-0 left-0 right-0 p-8 border-t-4 transition-all duration-500 ease-in-out transform ${
    showNext ? 'translate-y-0 opacity-100 bg-white border-green-100' : 'translate-y-full opacity-0 bg-transparent border-transparent'
  }`}>
    <div className="max-w-2xl mx-auto flex justify-between items-center">
      <div>
        <p className={`font-black text-2xl ${isCorrect ? 'text-green-600' : 'text-orange-500'}`}>
            {isCorrect ? "AMAZING!" : "KEEP GOING!"}
        </p>
        <p className="text-slate-400 font-bold text-sm">+5 Coins earned</p>
      </div>
      <button 
        onClick={onNext} 
        className="bg-green-500 hover:bg-green-600 text-white px-12 py-4 rounded-2xl font-black text-xl flex items-center gap-2 shadow-[0_6px_0_0_#16a34a] active:shadow-none active:translate-y-1 transition-all"
      >
        CONTINUE <ChevronRight size={28} />
      </button>
    </div>
  </div>
);