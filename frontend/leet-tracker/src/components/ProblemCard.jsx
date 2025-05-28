import {
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function ProblemCard({ problem, onEdit, onDelete }) {
  const navigate = useNavigate();

  const handleSolveNow = () => {
    navigate('/solutions', { state: { problemId: problem.id } });
  };

  return (
    <div className="card px-6 py-5 flex flex-col justify-between h-full relative">
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={handleSolveNow}
          className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-[var(--ctp-green-bg)] text-[var(--ctp-green)] hover:bg-[var(--ctp-surface1)] transition-colors duration-150"
          title="Add Solution"
        >
          <CodeBracketIcon className="h-5 w-5 mr-2" />
          Add Solution
        </button>
        <a
          href={problem.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg flex items-center justify-center bg-[var(--ctp-blue-bg)] text-[var(--ctp-blue)] hover:bg-[var(--ctp-surface1)] transition-colors duration-150"
          title="View Problem"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <button
          onClick={() => onEdit(problem)}
          className="p-2 rounded-lg flex items-center justify-center bg-[var(--ctp-yellow-bg)] text-[var(--ctp-yellow)] hover:bg-[var(--ctp-surface1)] transition-colors duration-150"
          title="Edit Problem"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => onDelete(problem.id)}
          className="p-2 rounded-lg flex items-center justify-center bg-[var(--ctp-red-bg)] text-[var(--ctp-red)] hover:bg-[var(--ctp-surface1)] transition-colors duration-150"
          title="Delete Problem"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="pr-2">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-[var(--ctp-blue)] truncate">
            {problem.name}
          </p>
          {problem.status === 'solved' && (
            <CheckCircleIcon className="h-5 w-5 text-[var(--ctp-green)]" title="Solved" />
          )}
          {problem.status === 'attempted' && (
            <ClockIcon className="h-5 w-5 text-[var(--ctp-yellow)]" title="Attempted" />
          )}
          {problem.status === 'unsolved' && (
            <XCircleIcon className="h-5 w-5 text-[var(--ctp-red)]" title="Unsolved" />
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={`tag ${
              problem.difficulty === 'easy'
                ? 'tag-easy'
                : problem.difficulty === 'medium'
                ? 'tag-medium'
                : 'tag-hard'
            }`}
          >
            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
          </span>
          <span className="tag tag-platform">
            {problem.platform}
          </span>
          {problem.tags?.map((tag) => (
            <span
              key={tag.id}
              className="tag tag-custom"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
} 