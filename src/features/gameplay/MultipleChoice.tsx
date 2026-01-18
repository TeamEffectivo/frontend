// src/features/gameplay/MultipleChoice.tsx
import type { Challenge } from '../../types';
import dictionaryData from '../../data/dictionary.json'; // Import your dictionary

interface Props {
  challenge: Challenge;
  onAnswer: (answer: string) => void;
  selectedOption: string | null;
  isCorrect: boolean | null;
  showNext: boolean;
}

export const MultipleChoice = ({ challenge, onAnswer, selectedOption, isCorrect, showNext }: Props) => {
  // 1. Look up the image URL from dictionary.json
  const alphabetDict = dictionaryData.dictionary;
  const lowercaseKey = challenge.answer.toLowerCase();
  const imageUrl = alphabetDict[lowercaseKey as keyof typeof alphabetDict];

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto gap-8">
      
      {/* THE QUESTION IMAGE */}
      <div className="w-56 h-56 bg-white rounded-[2.5rem] border-4 border-slate-100 shadow-xl flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Identify this sign"
            // Applied zoom scale to make the sign more visible for the player
            className="w-full h-full object-contain scale-[1.6]" 
          />
        ) : (
          <div className="text-slate-300 font-bold">Image missing</div>
        )}
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
              : "border-red-500 bg-red-50 text-red-700 shadow-none translate-y-1";
          }
          
          if (showNext && isTheCorrectAnswer) {
            buttonStyle = "border-green-500 bg-green-50 text-green-700 ring-4 ring-green-100";
          }

          return (
            <button
              key={opt}
              disabled={showNext}
              onClick={() => onAnswer(opt)}
              className={`p-6 border-4 rounded-3xl transition-all text-4xl font-black uppercase shadow-sm active:scale-95 ${buttonStyle}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};