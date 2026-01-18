import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore';
import curriculumData from '../../data/curriculum.json';
import { MultipleChoice } from './MultipleChoice';
import { SignInterpreter } from './SignInterpreter';
import { FillBlank } from './FillBlank';
import { X, ChevronRight, AlertCircle, Lightbulb } from 'lucide-react';
import type { Curriculum } from '../../types';

const curriculum = curriculumData as unknown as Curriculum;

export default function Lesson() {
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
      // Tutorials don't penalize batteries
      if (challenge.type !== 'TUTORIAL') {
        deductBattery();
        if (batteries <= 1) return navigate('/shop');
      }
      if (newAttempts >= 3) setShowNext(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col font-sans overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-32 flex flex-col items-center p-6">
        <div className="max-w-4xl w-full">
            <div className="flex items-center justify-center gap-3 mb-4">
                {challenge.type === 'TUTORIAL' && <Lightbulb className="text-yellow-500 animate-pulse" />}
                <h2 className="text-2xl md:text-3xl font-black text-center text-slate-800">
                {challenge.question}
                </h2>
            </div>

            {/* TUTORIAL LAYOUT */}
            {challenge.type === 'TUTORIAL' && (
                <div className="grid md:grid-cols-2 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col items-center gap-4 bg-slate-50 p-6 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                        <span className="bg-white px-4 py-1 rounded-full text-xs font-black text-slate-400 uppercase tracking-widest">Reference Image</span>
                        <img 
                            src={challenge.image} 
                            alt="Reference Sign" 
                            className="w-full max-w-[280px] aspect-square object-contain drop-shadow-xl"
                        />
                    </div>
                    <SignInterpreter 
                        expectedAnswer={challenge.answer} 
                        onSuccess={() => handleAnswer(challenge.answer)}
                        onFailure={() => handleAnswer("WRONG_GESTURE")} 
                    />
                </div>
            )}

            {/* STANDARD LAYOUTS */}
            <div className="w-full max-w-2xl mx-auto">
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
        </div>

        <FeedbackArea isCorrect={isCorrect} selectedOption={selectedOption} attempts={attempts} answer={challenge.answer} />
      </div>
    </div>
  );
}