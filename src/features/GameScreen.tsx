import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import curriculumData from "../data/curriculum.json";
import type { Curriculum, Challenge } from "../types";
import { X, ChevronRight } from "lucide-react";

const curriculum = curriculumData as unknown as Curriculum;

export default function GameScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Game Logic State
  const [step, setStep] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showNext, setShowNext] = useState(false);
  const [streak, setStreak] = useState(0);

  const { deductBattery, batteries, addCoin } = useUserStore();

  // Reset state when lesson changes
  // This is a valid pattern for resetting component state when a prop changes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setStep(0);
    setAttempts(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowNext(false);
    setStreak(0);
  }, [id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const lesson = curriculum.lessons.find((l) => l.id === id);
  if (!lesson) return <div>Lesson Not Found</div>;

  const challenge: Challenge = lesson.challenges[step];

  const handleAnswer = (userAnswer: string) => {
    if (showNext) return;
    const correct = userAnswer.toLowerCase() === challenge.answer.toLowerCase();
    setSelectedOption(userAnswer);
    setIsCorrect(correct);

    if (correct) {
      addCoin(5);
      setShowNext(true);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0); // Reset streak on wrong answer
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      deductBattery();

      if (batteries <= 1) {
        navigate("/shop"); // Or a "Game Over" screen
        return;
      }

      if (newAttempts >= 3) {
        setShowNext(true); // Reveal next button after 3 fails
      }
    }
  };

  const handleNext = () => {
    // Reset state for next step
    setAttempts(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowNext(false);
    // Note: streak persists across steps, only resets on wrong answer
    
    if (step < lesson.challenges.length - 1) {
      setStep(step + 1);
    } else {
      addCoin(50);
      navigate("/");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col font-sans">
      {/* Header */}
      <div className="p-6 flex items-center gap-6 max-w-4xl mx-auto w-full">
        <button onClick={() => navigate("/")}>
          <X size={32} className="text-gray-400 hover:text-gray-600" />
        </button>
        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{
              width: `${((step + 1) / lesson.challenges.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        {/* GIF Feedback Area - Above Question */}
        <div className="mb-8 flex items-center justify-center h-32">
          {isCorrect === true && streak >= 3 && (
            <img 
              src="/streak.gif" 
              alt="Streak!" 
              className="h-32 w-54 rounded-xl object-cover"
            />
          )}
          {isCorrect === true && streak < 3 && (
            <img 
              src="/happy.gif" 
              alt="Correct answer" 
              className="h-32 w-54 rounded-xl object-cover"
            />
          )}
          {isCorrect === false && selectedOption && attempts < 3 && (
            <img 
              src="/sad.gif" 
              alt="Wrong answer" 
              className="h-32 w-32 rounded-full object-cover"
            />
          )}
          {attempts >= 3 && !isCorrect && (
            <img 
              src="/sad.gif" 
              alt="Out of attempts" 
              className="h-32 w-32 rounded-full object-cover"
            />
          )}
        </div>

        <h2 className="text-4xl font-bold mb-12 text-center">
          {challenge.question}
        </h2>

        {/* MULTIPLE CHOICE TYPE */}
        {challenge.type === "MULTIPLE_CHOICE" && challenge.options && (
          <div className="grid grid-cols-2 gap-4 w-full">
            {challenge.options.map((opt) => {
              const isThisSelected = selectedOption === opt;
              const isTheCorrectAnswer =
                opt.toLowerCase() === challenge.answer.toLowerCase();

              let buttonStyle = "border-gray-200 text-gray-700";
              if (isThisSelected && !isCorrect)
                buttonStyle = "border-red-500 bg-red-50 text-red-700";
              if (showNext && isTheCorrectAnswer)
                buttonStyle =
                  "border-green-500 bg-green-50 text-green-700 shadow-[0_0_15px_rgba(34,197,94,0.3)]";

              return (
                <button
                  key={opt}
                  disabled={showNext}
                  onClick={() => handleAnswer(opt)}
                  className={`p-8 border-4 rounded-3xl font-bold text-2xl transition-all shadow-sm ${buttonStyle} ${!showNext && "hover:border-blue-300 active:scale-95"}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        
        {attempts >= 3 && !isCorrect && (
          <div className="h-20 mt-8 flex flex-col items-center justify-center">
            <div className="text-center">
              <p className="text-green-600 font-black text-xl italic">
                The correct answer is: {challenge.answer}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ACTION BAR */}
      <div
        className={`p-8 border-t-2 transition-all transform ${showNext ? "translate-y-0 bg-green-50" : "translate-y-full opacity-0"}`}
      >
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="text-green-700 font-bold text-xl">
            {isCorrect ? "Excellent! You got it." : "Keep practicing!"}
          </div>
          <button
            onClick={handleNext}
            className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-2xl font-black text-xl flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
          >
            CONTINUE <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
