import dictionaryData from '../data/dictionary.json';

interface ReferenceProps {
  sign: string;
}

export const Reference = ({ sign }: ReferenceProps) => {
  const lookupKey = sign.toLowerCase();
  const imageUrl = (dictionaryData.dictionary as Record<string, string>)[lookupKey];

  if (!imageUrl) {
    return (
      <div className="bg-slate-50 p-8 rounded-[2.5rem] border-4 border-slate-100 flex items-center justify-center h-full min-h-[300px]">
        <p className="text-slate-400 font-bold uppercase tracking-tighter">
          Sign "{sign}" not found
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 p-8 rounded-[2.5rem] border-4 border-slate-100 flex flex-col items-center shadow-inner animate-in fade-in zoom-in duration-500">
      <div className="flex items-center justify-between w-full mb-6">
        <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-black uppercase">
          Tutorial
        </span>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Character: {sign.toUpperCase()}
        </p>
      </div>

      <div className="relative group w-full flex justify-center">
        {/* Shadow decoration */}
        <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full -z-10" />
        
        <img 
          src={imageUrl} 
          alt={`ASL Sign for ${sign}`} 
          className="w-full max-w-[280px] aspect-square object-cover rounded-3xl border-4 border-white shadow-2xl transition-transform group-hover:scale-105 duration-700"
        />
      </div>

      <p className="mt-6 text-slate-500 font-bold text-center leading-tight">
        Mimic the hand shape shown above to progress.
      </p>
    </div>
  );
};