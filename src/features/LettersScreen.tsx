import { useState } from 'react';
import { X, Info } from 'lucide-react';
import dictionaryData from '../data/dictionary.json';

interface LetterItem {
  letter: string;
  image: string;
  description: string;
}

// Transform the JSON dictionary into the LetterItem array
const alphabetDict = dictionaryData.dictionary;

const ALPHABET: LetterItem[] = Object.keys(alphabetDict).map((key) => {
  // 1. Get the URL from the JSON (the value)
  const imageUrl = alphabetDict[key as keyof typeof alphabetDict];
  
  // 2. Format the display letter to be uppercase
  const displayLetter = key.toUpperCase();

  return {
    letter: displayLetter,
    image: imageUrl,
    description: `This is the sign for the letter ${displayLetter}. To perform this sign, position your hand clearly in front of your shoulder.`
  };
});
export default function LettersScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<LetterItem | null>(null);

  const filteredAlphabet = ALPHABET.filter(item => 
    item.letter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-24 px-8 pb-12 max-w-6xl mx-auto">
      {/* ... Header and Search code from before ... */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-800 mb-4">Letters Library</h1>
        <input 
          type="text"
          placeholder="Search for a letter..."
          className="w-full max-w-md p-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {filteredAlphabet.map((item) => (
          <div 
            key={item.letter}
            onClick={() => setSelectedLetter(item)}
            className="group bg-white border-2 border-slate-200 rounded-3xl p-4 flex flex-col items-center hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer"
          >
            <div className="w-full aspect-square bg-slate-100 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
              <img src={item.image} alt={item.letter} className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-black text-slate-700">{item.letter}</span>
          </div>
        ))}
      </div>

      {/* MODAL OVERLAY */}
      {selectedLetter && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          {/* Modal Container */}
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 flex justify-between items-center border-b">
              <h2 className="text-3xl font-black text-slate-800">Letter {selectedLetter.letter}</h2>
              <button 
                onClick={() => setSelectedLetter(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              <div className="w-full aspect-square bg-slate-50 rounded-[2rem] mb-6 flex items-center justify-center border-2 border-dashed border-slate-200">
                <img 
                  src={selectedLetter.image} 
                  alt={selectedLetter.letter} 
                  className="w-4/5 h-4/5 object-contain rounded-xl"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="text-blue-500 mt-1 shrink-0" size={20} />
                  <p className="text-slate-600 leading-relaxed">
                    {selectedLetter.description}
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <button 
                    onClick={() => setSelectedLetter(null)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}