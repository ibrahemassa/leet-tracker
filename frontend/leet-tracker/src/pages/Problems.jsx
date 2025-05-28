import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { problemsAPI, platformsAPI, tagsAPI } from '../services/api';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import FilterSection from '../components/FilterSection';
import ProblemCard from '../components/ProblemCard';

export default function Problems() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    platform_id: '',
    difficulty: 'easy',
    tags: [],
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const { data: platforms, isLoading: isLoadingPlatforms } = useQuery({
    queryKey: ['platforms'],
    queryFn: () => platformsAPI.getPlatforms(),
  });

  const { data: tags, isLoading: isLoadingTags } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsAPI.getTags(),
  });

  const { data: problems, isLoading: isLoadingProblems, refetch: refetchProblems } = useQuery({
    queryKey: ['problems', selectedTags, selectedStatus, selectedDifficulty],
    queryFn: () => {
      const params = {};
      if (selectedTags.length > 0) {
        params.tags = selectedTags;
      }
      if (selectedStatus) {
        params.status = selectedStatus;
      }
      if (selectedDifficulty) {
        params.difficulty = selectedDifficulty;
      }
      return problemsAPI.getAllProblems(params);
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => problemsAPI.createProblem(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['problems']);
      setIsModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => problemsAPI.updateProblem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['problems']);
      setIsModalOpen(false);
      setEditingProblem(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => problemsAPI.deleteProblem(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['problems']);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      platform_id: '',
      difficulty: 'easy',
      tags: [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingProblem) {
      updateMutation.mutate({ 
        id: editingProblem.id, 
        data: {
          ...formData,
          platform_id: Number(formData.platform_id),
          tags: formData.tags.map(tag => tag.id),
        }
      });
    } else {
      createMutation.mutate({
        ...formData,
        platform_id: Number(formData.platform_id),
        tags: formData.tags.map(tag => tag.id),
      });
    }
  };

  const handleEdit = (problem) => {
    setEditingProblem(problem);
    setFormData({
      name: problem.name,
      url: problem.url,
      platform_id: problem.platform_id,
      difficulty: problem.difficulty,
      tags: problem.tags || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleTagClick = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleStatusClick = (status) => {
    setSelectedStatus(selectedStatus === status ? null : status);
  };

  const handleDifficultyClick = (difficulty) => {
    setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty);
  };

  const handleClearAllFilters = () => {
    setSelectedTags([]);
    setSelectedStatus(null);
    setSelectedDifficulty(null);
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedStatus || selectedDifficulty;

  const handleSolveNow = (problem) => {
    navigate('/solutions', { state: { problemId: problem.id } });
  };

  if (isLoadingProblems || isLoadingPlatforms || isLoadingTags) {
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
            Coding Problems
          </h3>
          <p className="mt-2 text-[var(--ctp-subtext0)]">
            Manage your coding problems and track your progress
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingProblem(null);
            setIsModalOpen(true);
          }}
          className="btn-primary inline-flex items-center px-4 py-2 rounded-lg shadow-lg text-sm font-medium"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Problem
        </button>
      </div>

      <FilterSection
        tags={tags?.data}
        selectedTags={selectedTags}
        onTagSelect={handleTagClick}
        selectedStatus={selectedStatus}
        onStatusSelect={handleStatusClick}
        selectedDifficulty={selectedDifficulty}
        onDifficultySelect={handleDifficultyClick}
        onClearAll={handleClearAllFilters}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {problems?.data && problems.data.length > 0 ? (
          problems.data.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-[var(--ctp-subtext0)]">
            No problems found. Add your first problem to get started!
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="modal-backdrop"
              onClick={() => setIsModalOpen(false)}
            ></div>

            <div className="modal-content inline-block align-bottom px-6 pt-5 pb-6 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <form onSubmit={handleSubmit}>
                <div>
                  <h3 className="text-2xl font-bold text-[var(--ctp-text)] mb-6">
                    {editingProblem ? 'Edit Problem' : 'Add New Problem'}
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-[var(--ctp-subtext0)]"
                      >
                        Problem Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        maxLength={255}
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="form-input mt-1 block w-full"
                        placeholder="Enter problem name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="url"
                        className="block text-sm font-medium text-[var(--ctp-subtext0)]"
                      >
                        Problem URL
                      </label>
                      <input
                        type="url"
                        name="url"
                        id="url"
                        value={formData.url}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                        className="form-input mt-1 block w-full"
                        placeholder="https://leetcode.com/problems/..."
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="platform_id"
                        className="block text-sm font-medium text-[var(--ctp-subtext0)]"
                      >
                        Platform
                      </label>
                      <select
                        id="platform_id"
                        name="platform_id"
                        value={formData.platform_id}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            platform_id: e.target.value,
                          }))
                        }
                        className="form-select mt-1 block w-full"
                      >
                        <option value="">Select a platform</option>
                        {platforms?.data?.map((platform) => (
                          <option key={platform.id} value={platform.id}>
                            {platform.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="difficulty"
                        className="block text-sm font-medium text-[var(--ctp-subtext0)]"
                      >
                        Difficulty
                      </label>
                      <select
                        id="difficulty"
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            difficulty: e.target.value,
                          }))
                        }
                        className="form-select mt-1 block w-full"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="tags"
                        className="block text-sm font-medium text-[var(--ctp-subtext0)]"
                      >
                        Tags
                      </label>
                      <select
                        id="tags"
                        name="tags"
                        multiple
                        value={formData.tags.map(tag => tag.id)}
                        onChange={(e) => {
                          const selectedOptions = Array.from(e.target.selectedOptions);
                          const selectedTags = selectedOptions.map(option => ({
                            id: Number(option.value),
                            name: option.text,
                          }));
                          setFormData((prev) => ({
                            ...prev,
                            tags: selectedTags,
                          }));
                        }}
                        className="form-select mt-1 block w-full"
                      >
                        {tags?.data?.map((tag) => (
                          <option key={tag.id} value={tag.id}>
                            {tag.name}
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-sm text-[var(--ctp-subtext0)]">
                        Hold Ctrl (Command in Mac) to select multiple tags
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingProblem(null);
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
                      : editingProblem
                      ? 'Update Problem'
                      : 'Add Problem'}
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