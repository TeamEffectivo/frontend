// src/features/GameScreen.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import curriculumData from '../data/curriculum.json';
import { MultipleChoice } from './gameplay/MultipleChoice';
import { SignInterpreter } from './gameplay/SignInterpreter';
import { FillBlank } from './gameplay/FillBlank';
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
    <div className="fixed inset-0 bg-white z-[100] flex flex-col font-sans">
      {/* Header logic... */}
      <Header progress={((step + 1) / lesson.challenges.length) * 100} onExit={() => navigate('/')} />

      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <h2 className="text-4xl font-bold mb-12 text-center">{
          (challenge.type === 'MULTIPLE_CHOICE' || challenge.type === 'FILL_BLANK' || challenge.type === 'SIGN_RECOGNITION') &&
          challenge.question
        }</h2>

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
            onSuccess={() => handleAnswer(challenge.answer)} // Reuse your existing correct answer logic
            onFailure={() => handleAnswer("WRONG")}         // Trigger the red UI/battery deduct
          /> )}

        {challenge.type === 'FILL_BLANK' && (
          <FillBlank challenge={challenge} onAnswer={handleAnswer} showNext={showNext} />
        )}

        <FeedbackArea isCorrect={isCorrect} selectedOption={selectedOption} attempts={attempts} answer={challenge.answer} />
      </div>

      <Footer showNext={showNext} isCorrect={isCorrect} onNext={() => {
        if (step < lesson.challenges.length - 1) setStep(step + 1);
        else { addCoin(50); navigate('/'); }
      }} />
    </div>
  );
}

// Sub-components to keep the main return clean
const Header = ({ progress, onExit }: { progress: number, onExit: () => void }) => (
  <div className="p-6 flex items-center gap-6 max-w-4xl mx-auto w-full">
    <button onClick={onExit}><X size={32} className="text-gray-400" /></button>
    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${progress}%` }} />
    </div>
  </div>
);

const FeedbackArea = ({ isCorrect, selectedOption, attempts, answer }: any) => (
  <div className="h-20 mt-8 flex flex-col items-center justify-center text-center">
    {!isCorrect && selectedOption && attempts < 3 && (
      <div className="flex items-center gap-2 text-red-500 font-bold animate-bounce">
        <AlertCircle size={20} />
        <span>Not quite! Try again. ({3 - attempts} left)</span>
      </div>
    )}
    {attempts >= 3 && !isCorrect && (
      <div>
        <p className="text-red-500 font-bold text-sm uppercase">Out of attempts</p>
        <p className="text-green-600 font-black text-xl italic">Answer: {answer}</p>
      </div>
    )}
  </div>
);

const Footer = ({ showNext, isCorrect, onNext }: any) => (
  <div className={`p-8 border-t-2 transition-all transform ${showNext ? 'translate-y-0 bg-green-50' : 'translate-y-full opacity-0'}`}>
    <div className="max-w-2xl mx-auto flex justify-between items-center">
      <div className="text-green-700 font-bold text-xl">{isCorrect ? "Excellent!" : "Nice try!"}</div>
      <button onClick={onNext} className="bg-green-500 text-white px-10 py-4 rounded-2xl font-black text-xl flex items-center gap-2 shadow-lg">
        CONTINUE <ChevronRight size={24} />
      </button>
    </div>
  </div>
);