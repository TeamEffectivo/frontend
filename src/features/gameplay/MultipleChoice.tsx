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
    <div className="grid grid-cols-2 gap-4 w-full">
      {challenge.options?.map((opt) => {
        const isThisSelected = selectedOption === opt;
        const isTheCorrectAnswer = opt.toLowerCase() === challenge.answer.toLowerCase();

        let buttonStyle = "border-gray-200 text-gray-700";
        if (isThisSelected && !isCorrect) buttonStyle = "border-red-500 bg-red-50 text-red-700";
        if (showNext && isTheCorrectAnswer) buttonStyle = "border-green-500 bg-green-50 text-green-700 shadow-[0_0_15px_rgba(34,197,94,0.3)]";

        return (
          <button
            key={opt}
            disabled={showNext}
            onClick={() => onAnswer(opt)}
            className={`p-8 border-4 rounded-3xl font-bold text-2xl transition-all shadow-sm ${buttonStyle} 
              ${!showNext && 'hover:border-blue-300 active:scale-95'}`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
};