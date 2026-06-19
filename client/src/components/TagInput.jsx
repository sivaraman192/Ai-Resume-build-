import React, { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

export const TagInput = ({
  value = [],
  onChange,
  placeholder = 'Type a tag and press Enter',
  suggestions = [],
  sectionLabel = ''
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  const tags = Array.isArray(value) ? value : [];

  const getSuggestions = () => {
    const query = inputValue.toLowerCase().trim();
    if (!query) return [];

    if (query.startsWith('py')) {
      return ["Python", "Django", "Flask", "Pandas", "NumPy"];
    }
    if (query.startsWith('re')) {
      return ["React.js", "Redux", "Next.js", "TypeScript", "Tailwind CSS"];
    }
    if (query.startsWith('no')) {
      return ["Node.js", "Express.js", "REST API", "JWT Authentication", "MongoDB"];
    }
    if (query.startsWith('cl')) {
      return ["Microsoft Azure", "Google Cloud Platform", "AWS"];
    }

    // Default filter from suggestions array
    return (suggestions || []).filter((item) =>
      item.toLowerCase().includes(query)
    );
  };

  const filteredSuggestions = getSuggestions().filter((item) => {
    const isAlreadyAdded = tags.some(
      (tag) => tag.toLowerCase() === item.toLowerCase()
    );
    return !isAlreadyAdded;
  });

  // Handle clicking outside to close suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (tagText) => {
    const cleanTag = (tagText || inputValue).trim();
    if (!cleanTag) return;

    // Duplicates check
    if (tags.some((tag) => tag.toLowerCase() === cleanTag.toLowerCase())) {
      setInputValue('');
      setShowDropdown(false);
      return;
    }

    const updatedTags = [...tags.filter(Boolean), cleanTag];
    onChange(updatedTags);
    setInputValue('');
    setShowDropdown(false);
    setActiveIndex(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showDropdown && filteredSuggestions[activeIndex]) {
        addTag(filteredSuggestions[activeIndex]);
      } else {
        addTag(inputValue);
      }
    } else if (e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag if input is empty
      const updatedTags = tags.slice(0, -1);
      onChange(updatedTags);
    } else if (e.key === 'ArrowDown' && showDropdown && filteredSuggestions.length > 0) {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredSuggestions.length);
    } else if (e.key === 'ArrowUp' && showDropdown && filteredSuggestions.length > 0) {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const removeTag = (indexToRemove) => {
    const updatedTags = tags.filter((_, idx) => idx !== indexToRemove);
    onChange(updatedTags);
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-2 w-full relative">
      {sectionLabel && (
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">
          {sectionLabel} Suggestions Available
        </span>
      )}
      
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowDropdown(true);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowDropdown(true)}
            placeholder={placeholder}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
          />

          {/* Autocomplete Dropdown List */}
          {showDropdown && filteredSuggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1 divide-y divide-slate-50 dark:divide-slate-800">
              {filteredSuggestions.map((suggestion, index) => (
                <li
                  key={suggestion}
                  onClick={() => addTag(suggestion)}
                  className={`px-4 py-2 text-xs font-semibold cursor-pointer transition-colors flex items-center justify-between ${
                    index === activeIndex
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400'
                      : 'text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <span>{suggestion}</span>
                  <span className="text-[9px] text-slate-400 opacity-60 font-mono">click to add</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <button
          type="button"
          onClick={() => addTag()}
          className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-650 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Render Tags Row */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100/30 text-indigo-655 dark:text-indigo-400 text-xs font-bold shadow-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(idx)}
                className="p-0.5 hover:bg-indigo-150 dark:hover:bg-indigo-900/60 rounded text-indigo-455 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
