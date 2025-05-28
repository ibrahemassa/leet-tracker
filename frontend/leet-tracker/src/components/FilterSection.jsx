import { useState } from 'react';

export default function FilterSection({ 
  tags,
  selectedTags,
  onTagSelect,
  selectedStatus,
  onStatusSelect,
  selectedDifficulty,
  onDifficultySelect,
  languages,
  selectedLanguage,
  onLanguageSelect,
  onClearAll
}) {
  const hasActiveFilters = (
    (selectedTags?.length > 0) || 
    selectedStatus || 
    selectedDifficulty || 
    selectedLanguage
  );

  return (
    <div className="space-y-4">
      {onStatusSelect && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-[var(--ctp-subtext0)] mr-2">Status:</span>
          {[
            { value: 'solved', color: 'bg-[var(--ctp-green-bg)] text-[var(--ctp-green)]' },
            { value: 'attempted', color: 'bg-[var(--ctp-yellow-bg)] text-[var(--ctp-yellow)]' },
            { value: 'unsolved', color: 'bg-[var(--ctp-red-bg)] text-[var(--ctp-red)]' }
          ].map(({ value, color }) => (
            <button
              key={value}
              onClick={() => onStatusSelect(value)}
              className={`tag px-3 py-1 rounded-full text-sm font-medium transition-all duration-150 ${color} ${
                selectedStatus === value
                  ? 'ring-2 ring-[var(--ctp-blue)] scale-105'
                  : 'hover:ring-2 hover:ring-[var(--ctp-blue)] hover:scale-105'
              }`}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
      )}

      {onDifficultySelect && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-[var(--ctp-subtext0)] mr-2">Difficulty:</span>
          {[
            { value: 'easy', color: 'bg-[var(--ctp-green-bg)] text-[var(--ctp-green)]' },
            { value: 'medium', color: 'bg-[var(--ctp-yellow-bg)] text-[var(--ctp-yellow)]' },
            { value: 'hard', color: 'bg-[var(--ctp-red-bg)] text-[var(--ctp-red)]' }
          ].map(({ value, color }) => (
            <button
              key={value}
              onClick={() => onDifficultySelect(value)}
              className={`tag px-3 py-1 rounded-full text-sm font-medium transition-all duration-150 ${color} ${
                selectedDifficulty === value
                  ? 'ring-2 ring-[var(--ctp-blue)] scale-105'
                  : 'hover:ring-2 hover:ring-[var(--ctp-blue)] hover:scale-105'
              }`}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
      )}

      {onLanguageSelect && languages && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-[var(--ctp-subtext0)] mr-2">Language:</span>
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageSelect(lang)}
              className={`tag px-3 py-1 rounded-full text-sm font-medium transition-all duration-150 bg-[var(--ctp-blue-bg)] text-[var(--ctp-blue)] ${
                selectedLanguage === lang
                  ? 'ring-2 ring-[var(--ctp-blue)] scale-105'
                  : 'hover:ring-2 hover:ring-[var(--ctp-blue)] hover:scale-105'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      )}

      {tags && onTagSelect && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-[var(--ctp-subtext0)] mr-2">Tags:</span>
          {tags?.map((tag) => (
            <button
              key={tag.id}
              onClick={() => onTagSelect(tag.id)}
              className={`tag tag-custom px-3 py-1 rounded-full text-sm font-medium transition-all duration-150 ${
                selectedTags?.includes(tag.id)
                  ? 'border-2 border-[var(--ctp-blue)]'
                  : ''
              } hover:border-2 hover:border-[var(--ctp-blue)]`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {hasActiveFilters && (
        <button
          onClick={onClearAll}
          className="tag px-3 py-1 rounded-full text-sm font-medium bg-[var(--ctp-surface0)] text-[var(--ctp-blue)] border border-[var(--ctp-blue)] hover:bg-[var(--ctp-blue)] hover:text-white transition-all duration-150"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
} 