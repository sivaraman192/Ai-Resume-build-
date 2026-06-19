import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export const BulletInput = ({ value = [], onChange, placeholder = 'Type an achievement and press Enter' }) => {
  const [inputValue, setInputValue] = useState('');

  // Safeguard array type
  const bullets = Array.isArray(value) ? value : [];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addBullet();
    }
  };

  const addBullet = () => {
    const cleanInput = inputValue.trim();
    if (!cleanInput) return;

    // Check duplicates
    if (bullets.some((bullet) => bullet.toLowerCase() === cleanInput.toLowerCase())) {
      setInputValue('');
      return;
    }

    const updatedBullets = [...bullets.filter(b => b && b.trim() !== ''), cleanInput];
    onChange(updatedBullets);
    setInputValue('');
  };

  const removeBullet = (indexToRemove) => {
    const updatedBullets = bullets.filter((_, idx) => idx !== indexToRemove);
    onChange(updatedBullets.length > 0 ? updatedBullets : ['']);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
        />
        <button
          type="button"
          onClick={addBullet}
          className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950/20 text-slate-500 hover:text-indigo-650 transition"
        >
          <Plus className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Render Bullet List */}
      {bullets.length > 0 && bullets.some(b => b && b.trim() !== '') && (
        <ul className="flex flex-col gap-2.5 mt-2 list-none pl-0">
          {bullets.filter(b => b && b.trim() !== '').map((bullet, idx) => (
            <li key={idx} className="flex items-start justify-between gap-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 p-2.5 rounded-lg">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium select-text whitespace-pre-wrap flex-1">{bullet}</span>
              <button
                type="button"
                onClick={() => removeBullet(idx)}
                className="p-1 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md text-slate-450 hover:text-rose-600 transition shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BulletInput;
