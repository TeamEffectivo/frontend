import { Link } from 'react-router-dom';
// import { useUserStore } from '../../store/useUserStore';
import curriculumData from '../data/curriculum.json';
import type { Curriculum } from '../types';
// import { Flame, BatteryFull, Trophy } from 'lucide-react';

// Explicitly cast the imported JSON
const curriculum = curriculumData as Curriculum;

export default function MapScreen() {
  // const { streak, batteries, coins } = useUserStore();

  // SAFETY CHECK: If curriculum or lessons is missing, show a loading state
  if (!curriculum || !curriculum.lessons) {
    return (
      <div className="ml-24 p-10">
        <p>Loading curriculum or data format is incorrect...</p>
      </div>
    );
  }

  return (
    <div className="ml-24 min-h-screen bg-white pb-20">
      {/* ... Header code remains the same ... */}

      <div className="max-w-2xl mx-auto mt-12 flex flex-col items-center gap-16">
        {curriculum.lessons.map((lesson, index) => {
          const indent = index % 4 === 1 ? 'translate-x-12' : 
                        index % 4 === 2 ? 'translate-x-24' : 
                        index % 4 === 3 ? 'translate-x-12' : 'translate-x-0';

          return (
            <div key={lesson.id} className={`relative ${indent}`}>
              <Link to={`/lesson/${lesson.id}`}>
                <button className="group relative">
                  <div className="w-20 h-20 rounded-full bg-blue-500 border-b-8 border-blue-700 group-active:border-b-0 group-active:translate-y-2 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                    {index + 1}
                  </div>
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}