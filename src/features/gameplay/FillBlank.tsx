// src/features/gameplay/FillBlank.tsx
import type { Challenge } from '../../types';

interface Props {
  challenge: Challenge;
  onAnswer: (answer: string) => void;
  showNext: boolean;
}

export const FillBlank = ({ challenge, onAnswer, showNext }: Props) => {
  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-6xl font-mono tracking-widest">{challenge.text}</p>
      <input
        autoFocus
        disabled={showNext}
        className="w-24 h-24 text-center text-4xl border-4 border-blue-500 rounded-3xl outline-none disabled:opacity-50"
        onChange={(e) => {
          if (e.target.value.length === 1) onAnswer(e.target.value);
        }}
      />
    </div>
  );
};