import { useUserStore } from '../store/useUserStore';
import { Snowflake, BatteryFull, Coins } from 'lucide-react';

export default function ShopScreen() {
  const { coins, buyItem, streakFreezes, batteries } = useUserStore();

  const inventory = [
    {
      id: 'freeze' as const,
      name: 'Streak Freeze',
      description: 'Protects your streak for one day of inactivity.',
      cost: 200,
      owned: streakFreezes,
      icon: <Snowflake size={40} className="text-blue-400" />,
      color: 'bg-blue-50'
    },
    {
      id: 'battery' as const,
      name: 'Battery Refill',
      description: 'Restore your health to keep learning.',
      cost: 50,
      owned: batteries,
      icon: <BatteryFull size={40} className="text-red-400" />,
      color: 'bg-red-50'
    }
  ];

  return (
    <div className="p-12 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black">Shop</h1>
        <div className="bg-yellow-100 px-6 py-2 rounded-2xl flex items-center gap-2 text-yellow-700 font-bold text-xl">
          <Coins /> {coins}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {inventory.map((item) => (
          <div key={item.id} className="border-2 border-gray-100 rounded-3xl p-8 flex items-center gap-8 hover:border-gray-200 transition-colors">
            <div className={`p-6 rounded-2xl ${item.color}`}>
              {item.icon}
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{item.name}</h3>
              <p className="text-gray-500">{item.description}</p>
              <p className="text-sm mt-1 font-semibold text-gray-400">Currently have: {item.owned}</p>
            </div>

            <button 
              onClick={() => buyItem(item.id, item.cost)}
              disabled={coins < item.cost}
              className={`px-8 py-4 rounded-2xl font-black text-xl shadow-md transition-all active:translate-y-1
                ${coins >= item.cost 
                  ? 'bg-blue-500 text-white border-b-4 border-blue-700' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed border-b-4 border-gray-300'}`}
            >
              GET {item.cost}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}