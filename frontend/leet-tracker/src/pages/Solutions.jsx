import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { solutionsAPI, problemsAPI, tagsAPI } from '../services/api';
import {
  PlusIcon,
  EyeIcon,
  TrashIcon,
  LinkIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import FilterSection from '../components/FilterSection';
import { useLocation } from 'react-router-dom';

const LANGUAGE_OPTIONS = [
  'Python',
  'JavaScript',
  'Java',
  'C++',
  'Rust',
  'Go',
  'Swift',
];

const STATUS_OPTIONS = [
  'unsolved',
  'attempted',
  'solved',
];

export default function Solutions() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState(null);
  const [formData, setFormData] = useState({
    problem_id: '',
    status: 'unsolved',
    language: 'Python',
    code: '',
    sol_url: '',
  });
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [showModalSolution, setShowModalSolution] = useState(null);

  const { data: solutionsResponse, isLoading: solutionsLoading } = useQuery({
    queryKey: ['solutions', selectedStatus, selectedDifficulty, selectedLanguage],
    queryFn: () => {
      const params = {};
      if (selectedStatus) {
        params.status = selectedStatus;
      }
      if (selectedDifficulty) {
        params.difficulty = selectedDifficulty;
      }
      if (selectedLanguage) {
        params.language = selectedLanguage;
      }
      return solutionsAPI.getSolutionsWithFilters(params);
    },
  });

  const solutions = solutionsResponse?.data || [];

  const { data: problems, isLoading: problemsLoading } = useQuery({
    queryKey: ['problems'],
    queryFn: () => problemsAPI.getProblems(),
  });

  const {data: allProblems, isLoading: allProblemsLoading} = useQuery({
    queryKey: ['allProblems'],
    queryFn: () => problemsAPI.getAllProblems(),
  });

  const { data: tags, isLoading: isLoadingTags } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsAPI.getTags(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => solutionsAPI.createSolution(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['solutions']);
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating solution:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create solution. Please try again.';
      alert(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => solutionsAPI.updateSolution(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['solutions']);
      setIsModalOpen(false);
      setEditingSolution(null);
      resetForm();
    },
    onError: (error) => {
      console.error('Error updating solution:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update solution. Please try again.';
      alert(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => solutionsAPI.deleteSolution(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['solutions']);
    },
    onError: (error) => {
      console.error('Error deleting solution:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete solution. Please try again.';
      alert(errorMessage);
    },
  });

  const resetForm = () => {
    setFormData({
      problem_id: '',
      status: 'unsolved',
      language: 'Python',
      code: '',
      sol_url: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.problem_id) {
      alert('Please select a problem');
      return;
    }

    const submitData = {
      problem_id: Number(formData.problem_id),
      status: formData.status,
      language: formData.language,
      code: formData.code || '',
      sol_url: formData.sol_url || '',
    };

    if (editingSolution) {
      updateMutation.mutate({ id: editingSolution.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleEdit = (solution) => {
    setEditingSolution(solution);
    setFormData({
      problem_id: solution.problem_id,
      status: solution.status,
      language: solution.language,
      code: solution.code || '',
      sol_url: solution.sol_url || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this solution?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusClick = (status) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  const handleDifficultyClick = (difficulty) => {
    setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty);
  };

  const handleLanguageClick = (language) => {
    setSelectedLanguage(selectedLanguage === language ? null : language);
  };

  const handleClearAllFilters = () => {
    setSelectedStatus(null);
    setSelectedDifficulty(null);
    setSelectedLanguage(null);
  };

  const filteredSolutions = solutions;

  useEffect(() => {
    if (location.state?.problemId) {
      setFormData(prev => ({
        ...prev,
        problem_id: location.state.problemId
      }));
      setIsModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  if (solutionsLoading || problemsLoading || allProblemsLoading || isLoadingTags) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-[var(--ctp-blue)]">
            Solutions
          </h3>
          <p className="mt-2 text-[var(--ctp-subtext0)]">
            Manage your problem solutions and track your progress
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingSolution(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 rounded-lg shadow-lg text-sm font-medium bg-[var(--ctp-green-bg)] text-[var(--ctp-green)] hover:bg-[var(--ctp-surface1)] transition-colors duration-150"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Solution
        </button>
      </div>

      <FilterSection
        selectedStatus={selectedStatus}
        onStatusSelect={handleStatusClick}
        selectedDifficulty={selectedDifficulty}
        onDifficultySelect={handleDifficultyClick}
        languages={LANGUAGE_OPTIONS}
        selectedLanguage={selectedLanguage}
        onLanguageSelect={handleLanguageClick}
        onClearAll={handleClearAllFilters}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSolutions?.map((solution) => {
          const problem = problems?.data?.find(
            (p) => p.id === Number(solution.problem_id)
          );
          return (
            <div key={`solution-${solution.id}`} className="card px-6 py-5 flex flex-col justify-between h-full relative">
              <div className="absolute top-4 right-4 flex space-x-2">
                {solution.sol_url && (
                  <a
                    href={solution.sol_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg flex items-center justify-center bg-[var(--ctp-blue-bg)] text-[var(--ctp-blue)] hover:bg-[var(--ctp-surface1)] transition-colors duration-150"
                    title="View Solution"
                  >
                    <LinkIcon className="h-5 w-5" />
                  </a>
                )}
                <button
                  onClick={() => {
                    setShowModalSolution({ solution, problem });
                  }}
                  className="p-2 rounded-lg flex items-center justify-center bg-[var(--ctp-green-bg)] text-[var(--ctp-green)] hover:bg-[var(--ctp-surface1)] transition-colors duration-150"
                  title="Show Solution"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(solution.id)}
                  className="p-2 rounded-lg flex items-center justify-center bg-[var(--ctp-red-bg)] text-[var(--ctp-red)] hover:bg-[var(--ctp-surface1)] transition-colors duration-150"
                  title="Delete Solution"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="pr-2">
                <div className="flex items-center flex-wrap gap-2">
                  <p className="text-md font-semibold text-[var(--ctp-blue)] truncate">
                    {problem?.name || 'Unknown Problem'}
                  </p>
                  <span
                    className={`tag ${
                      problem?.difficulty === 'easy'
                        ? 'tag-easy'
                        : problem?.difficulty === 'medium'
                        ? 'tag-medium'
                        : 'tag-hard'
                    }`}
                  >
                    {problem?.difficulty.charAt(0).toUpperCase() + problem?.difficulty.slice(1) || 'Unknown'}
                  </span>
                  <span
                    className={`tag ${
                      solution.status === 'solved'
                        ? 'bg-[var(--ctp-green-bg)] text-[var(--ctp-green)]'
                        : solution.status === 'attempted'
                        ? 'bg-[var(--ctp-yellow-bg)] text-[var(--ctp-yellow)]'
                        : 'bg-[var(--ctp-red-bg)] text-[var(--ctp-red)]'
                    }`}
                  >
                    {solution.status.charAt(0).toUpperCase() + solution.status.slice(1)}
                  </span>
                  <span className="tag tag-platform">
                    {solution.language}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {filteredSolutions?.length === 0 && (
          <div className="col-span-full text-center text-[var(--ctp-subtext0)] text-lg py-12">
            No solutions found matching the selected filters.
          </div>
        )}
      </div>

      {showModalSolution && (
        <div className="fixed z-20 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="modal-backdrop"
              onClick={() => setShowModalSolution(null)}
            ></div>
            <div className="modal-content inline-block align-bottom px-6 pt-5 pb-6 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-[var(--ctp-blue)]">
                  Solution Details
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      handleEdit(showModalSolution.solution);
                      setShowModalSolution(null);
                    }}
                    className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-[var(--ctp-yellow-bg)] text-[var(--ctp-yellow)] hover:bg-[var(--ctp-surface1)] transition-colors duration-150"
                  >
                    <PencilIcon className="h-5 w-5 mr-2" />
                    Edit Solution
                  </button>
                  <button
                    onClick={() => setShowModalSolution(null)}
                    className="btn-secondary px-3 py-1 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <span className="tag tag-platform">{showModalSolution.solution.language}</span>
                  <span className={`tag ${
                    showModalSolution.solution.status === 'solved'
                      ? 'bg-[var(--ctp-green-bg)] text-[var(--ctp-green)]'
                      : showModalSolution.solution.status === 'attempted'
                      ? 'bg-[var(--ctp-yellow-bg)] text-[var(--ctp-yellow)]'
                      : 'bg-[var(--ctp-red-bg)] text-[var(--ctp-red)]'
                  }`}>
                    {showModalSolution.solution.status.charAt(0).toUpperCase() + showModalSolution.solution.status.slice(1)}
                  </span>
                  <span className={`tag ${
                    showModalSolution.problem?.difficulty === 'easy'
                      ? 'tag-easy'
                      : showModalSolution.problem?.difficulty === 'medium'
                      ? 'tag-medium'
                      : 'tag-hard'
                  }`}>
                    {showModalSolution.problem?.difficulty || 'Unknown'}
                  </span>
                </div>
                <div>
                  <div className="text-lg font-semibold text-[var(--ctp-blue)] mb-2">
                    {showModalSolution.problem?.name || 'Unknown Problem'}
                  </div>
                  <a
                    href={showModalSolution.solution.sol_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--ctp-blue)] hover:text-[var(--ctp-sapphire)] text-sm"
                  >
                    View Solution Submission
                  </a>
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--ctp-subtext0)] mb-2">Solution Code</div>
                  <div className="rounded-lg overflow-hidden border border-[var(--ctp-surface1)]">
                    <SyntaxHighlighter
                      language={showModalSolution.solution.language?.toLowerCase() || 'python'}
                      style={oneDark}
                      customStyle={{ background: 'var(--ctp-surface0)', color: 'var(--ctp-text)', fontSize: '1em', margin: 0 }}
                      showLineNumbers
                    >
                      {showModalSolution.solution.code || '// No code provided'}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="modal-backdrop"
              onClick={() => {
                setIsModalOpen(false);
                setEditingSolution(null);
                resetForm();
              }}
            ></div>

            <div className="modal-content inline-block align-bottom px-6 pt-5 pb-6 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div>
                  <h3 className="text-2xl font-bold text-[var(--ctp-blue)] mb-6">
                    {editingSolution ? 'Edit Solution' : 'Add New Solution'}
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="problem_id"
                        className="block text-sm font-medium text-[var(--ctp-subtext0)]"
                      >
                        Problem
                      </label>
                      <select
                        id="problem_id"
                        name="problem_id"
                        required
                        value={formData.problem_id}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            problem_id: e.target.value,
                          }))
                        }
                        className="form-select mt-1 block w-full"
                      >
                        <option value="">Select a problem</option>
                        {allProblems?.data?.map((problem) => (
                          <option key={problem.id} value={problem.id}>
                            {problem.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-[var(--ctp-subtext0)]"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        required
                        value={formData.status}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        className="form-select mt-1 block w-full"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="language"
                        className="block text-sm font-medium text-[var(--ctp-subtext0)]"
                      >
                        Language
                      </label>
                      <select
                        id="language"
                        name="language"
                        required
                        value={formData.language}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            language: e.target.value,
                          }))
                        }
                        className="form-select mt-1 block w-full"
                      >
                        {LANGUAGE_OPTIONS.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="code"
                        className="block text-sm font-medium text-[var(--ctp-subtext0)]"
                      >
                        Solution Code
                      </label>
                      <textarea
                        id="code"
                        name="code"
                        rows={10}
                        value={formData.code}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            code: e.target.value,
                          }))
                        }
                        className="form-input mt-1 block w-full font-mono"
                        placeholder="Paste your solution code here..."
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="sol_url"
                        className="block text-sm font-medium text-[var(--ctp-subtext0)]"
                      >
                        Solution URL
                      </label>
                      <input
                        type="url"
                        id="sol_url"
                        name="sol_url"
                        value={formData.sol_url}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            sol_url: e.target.value,
                          }))
                        }
                        className="form-input mt-1 block w-full"
                        placeholder="https://leetcode.com/submissions/detail/..."
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingSolution(null);
                      resetForm();
                    }}
                    className="btn-secondary px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="btn-primary px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? 'Saving...'
                      : editingSolution
                      ? 'Update'
                      : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
 