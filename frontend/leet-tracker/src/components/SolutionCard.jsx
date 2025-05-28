import { useState } from 'react';
import {
  PencilIcon,
  TrashIcon,
  CodeBracketIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline';

export default function SolutionCard({ solution, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getLanguageColor = (language) => {
    const colors = {
      python: 'bg-[var(--ctp-green)]',
      javascript: 'bg-[var(--ctp-yellow)]',
      java: 'bg-[var(--ctp-red)]',
      cpp: 'bg-[var(--ctp-blue)]',
      csharp: 'bg-[var(--ctp-purple)]',
      go: 'bg-[var(--ctp-teal)]',
      rust: 'bg-[var(--ctp-orange)]',
      kotlin: 'bg-[var(--ctp-pink)]',
      swift: 'bg-[var(--ctp-mauve)]',
      typescript: 'bg-[var(--ctp-sky)]',
    };
    return colors[language.toLowerCase()] || 'bg-[var(--ctp-subtext0)]';
  };

  return (
    <div className="bg-[var(--ctp-surface0)] rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <LanguageIcon className="h-5 w-5 text-[var(--ctp-subtext0)]" />
              <span className={`px-2 py-1 rounded text-sm font-medium ${getLanguageColor(solution.language)}`}>
                {solution.language}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--ctp-text)] mb-2">
              {solution.title}
            </h3>
            <p className="text-[var(--ctp-subtext0)] text-sm mb-4">
              {solution.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(solution)}
              className="p-2 text-[var(--ctp-subtext0)] hover:text-[var(--ctp-blue)] transition-colors"
              title="Edit Solution"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(solution.id)}
              className="p-2 text-[var(--ctp-subtext0)] hover:text-[var(--ctp-red)] transition-colors"
              title="Delete Solution"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-[var(--ctp-blue)] hover:text-[var(--ctp-sky)] transition-colors"
          >
            <CodeBracketIcon className="h-5 w-5" />
            <span>{isExpanded ? 'Hide Code' : 'Show Code'}</span>
          </button>

          {isExpanded && (
            <div className="mt-4">
              <pre className="bg-[var(--ctp-base)] p-4 rounded-lg overflow-x-auto">
                <code className="text-[var(--ctp-text)]">{solution.code}</code>
              </pre>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {solution.tags?.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 rounded text-sm font-medium bg-[var(--ctp-surface1)] text-[var(--ctp-subtext0)]"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
} 