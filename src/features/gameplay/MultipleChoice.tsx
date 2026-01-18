// src/features/gameplay/MultipleChoice.tsx
import type { Challenge } from '../../types';

interface Props {
  challenge: Challenge;
  onAnswer: (answer: string) => void;
  selectedOption: string | null;
  isCorrect: boolean | null;
  showNext: boolean;
}

export const MultipleChoice = ({ challenge, onAnswer, selectedOption, isCorrect, showNext }: Props) => {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto gap-8">
      
      {/* THE QUESTION IMAGE */}
      <div className="w-48 h-48 bg-white rounded-[2.5rem] border-4 border-slate-100 shadow-inner flex items-center justify-center overflow-hidden">
        <img 
          src={`../../public/letters/${challenge.answer.toLowerCase()}.png`} 
          alt="Identify this sign"
          className="w-4/5 h-4/5 object-contain"
        />
      </div>

      <h2 className="text-2xl font-black text-slate-700 mb-2">Which letter is this?</h2>

      {/* THE OPTIONS GRID */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {challenge.options?.map((opt) => {
          const isThisSelected = selectedOption === opt;
          const isTheCorrectAnswer = opt.toLowerCase() === challenge.answer.toLowerCase();

          let buttonStyle = "border-slate-200 text-slate-700 bg-white hover:border-blue-400";
          
          if (isThisSelected) {
            buttonStyle = isCorrect 
              ? "border-green-500 bg-green-50 text-green-700" 
              : "border-red-500 bg-red-50 text-red-700";
          }
          
          if (showNext && isTheCorrectAnswer) {
            buttonStyle = "border-green-500 bg-green-50 text-green-700 ring-4 ring-green-100";
          }

          return (
            <button
              key={opt}
              disabled={showNext}
              onClick={() => onAnswer(opt)}
              className={`p-6 border-4 rounded-3xl transition-all text-3xl font-black uppercase shadow-sm active:scale-95 ${buttonStyle}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};