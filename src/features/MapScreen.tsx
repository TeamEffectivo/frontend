import { Link } from 'react-router-dom';
import curriculumData from '../data/curriculum.json';
import type { Curriculum } from '../types';
import Palmo from '../components/Palmo';
import { useEffect, useRef } from 'react';
import Bush from '../components/Bush';
import Flower from '../components/Flower';

const curriculum = curriculumData as Curriculum;

export default function MapScreen() {
  // Get the player's progress. Default to 0 (Lesson 1) if nothing is in storage.
  const rawProgress = localStorage.getItem('palmo_user_progress');
  if (!rawProgress) localStorage.setItem(`palmo_user_progress`, "0")
  const currentLevelIndex = rawProgress ? parseInt(rawProgress, 10) : 0;

  const activeLessonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToPalmoSlowly = () => {
      if (!activeLessonRef.current) return;

      const targetY = activeLessonRef.current.getBoundingClientRect().top + window.pageYOffset - (window.innerHeight / 2);
      const startY = window.pageYOffset;
      const distance = targetY - startY;
      const duration = 1500;
      let start: number | null = null;

      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);

        const easing = percentage < 0.6
          ? 2 * percentage * percentage
          : -1 + (4 - 2 * percentage) * percentage;

        window.scrollTo(0, startY + distance * easing);

        if (progress < duration) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    };

    const timer = setTimeout(scrollToPalmoSlowly, 300);
    return () => {
      clearTimeout(timer);
      window.scrollTo(0, 0);
    };
  }, []);

  if (!curriculum || !curriculum.lessons) {
    return (
      <div className="ml-24 p-10 text-white">
        <p>Loading curriculum...</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen pb-40 pr-24 bg-[length:100%_auto] bg-repeat-y bg-top"
      style={{ backgroundImage: "url('/background.png')" }} 
    >
        <div className="absolute translate-x-30 translate-y-125 z-10 pointer-events-none scale-150"><Bush/></div>
        <div className="absolute translate-x-245 translate-y-200 z-10 pointer-events-none scale-150"><Bush/></div>
        <div className="absolute translate-x-30 translate-y-125 z-10 pointer-events-none scale-150"><Bush/></div>
        <div className="absolute translate-x-245 translate-y-800 z-10 pointer-events-none scale-150"><Bush/></div>
        <div className="absolute translate-x-105 translate-y-75 z-10 pointer-events-none scale-155"><Flower/></div>
        <div className="absolute translate-x-335 translate-y-180 z-10 pointer-events-none scale-155"><Flower/></div>
        <div className="absolute translate-x-25 translate-y-200 z-10 pointer-events-none scale-125"><Flower/></div>
        <div className="absolute translate-x-395 translate-y-380 z-10 pointer-events-none scale-155"><Flower/></div>
        <div className="absolute translate-x-25 translate-y-400 z-10 pointer-events-none scale-125"><Flower/></div>
        <div className="absolute translate-x-95 translate-y-680 z-10 pointer-events-none scale-125"><Flower/></div>
      <div className="max-w-2xl mx-auto pt-24 flex flex-col items-center gap-20">
        {curriculum.lessons.map((lesson, index) => {

          const isCompleted = index < currentLevelIndex;
          const isActive = index === currentLevelIndex;
          const isLocked = index > currentLevelIndex;


          const indent = 
            index % 8 === 1 ? '-translate-x-22' :
            index % 8 === 2 ? '-translate-x-40' : 
            index % 8 === 3 ? '-translate-x-22' : 
            index % 8 === 4 ? '-translate-x-0' :
            index % 8 === 5 ? 'translate-x-22' : 
            index % 8 === 6 ? 'translate-x-40' : 
            index % 8 === 7 ? 'translate-x-22' : 
            'translate-x-0';

          return (
            <div
              key={lesson.id}
              ref={isActive ? activeLessonRef : null}
              className={`relative transition-transform duration-500 ${indent}`}
            >
              {isLocked ? (
                /* Locked Style */
                <button disabled className="relative cursor-not-allowed opacity-60">
                  <div className="w-20 h-20 rounded-full border-b-8 bg-gray-400 border-gray-600 flex items-center justify-center text-gray-200 text-2xl font-black">
                    {index + 1}
                  </div>
                </button>
              ) : (
                /* Completed or Active Style */
                <Link to={`/lesson/${lesson.id}`}>
                  <button className="group relative">
                    {isActive && (
                      <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                        <Palmo />
                      </div>
                    )}

                    <div className={`
                      w-20 h-20 rounded-full border-b-8 flex items-center justify-center text-white text-2xl font-black shadow-lg
                      ${isCompleted ? 'bg-yellow-500 border-yellow-700': 'bg-gray-500 border-gray-700'} 
                      group-active:border-b-0 group-active:translate-y-2 transition-all
                    `}>
                      {index + 1}
                    </div>
                  </button>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}