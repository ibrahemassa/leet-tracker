import { useQuery } from '@tanstack/react-query';
import { authAPI, tagsAPI } from '../services/api';
import {
  ChartBarIcon,
  CheckCircleIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import StatsCharts from './StatsCharts';

export default function UserStats() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: () => authAPI.getUserStats(),
  });

  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsAPI.getTags(),
  });

  if (statsLoading || tagsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const userStats = stats?.data || {
    total_solved: 0,
    difficulty_stats: {
      easy: 0,
      medium: 0,
      hard: 0
    },
    tags_stat: {}
  };

  const difficultyStats = [
    {
      name: 'Easy',
      count: userStats.difficulty_stats?.easy || 0,
      color: 'bg-[var(--ctp-green-bg)] text-[var(--ctp-green)]',
      chartColor: 'rgba(166, 227, 161, 0.8)',
      borderColor: 'rgb(166, 227, 161)',
    },
    {
      name: 'Medium',
      count: userStats.difficulty_stats?.medium || 0,
      color: 'bg-[var(--ctp-yellow-bg)] text-[var(--ctp-yellow)]',
      chartColor: 'rgba(249, 226, 175, 0.8)',
      borderColor: 'rgb(249, 226, 175)',
    },
    {
      name: 'Hard',
      count: userStats.difficulty_stats?.hard || 0,
      color: 'bg-[var(--ctp-red-bg)] text-[var(--ctp-red)]',
      chartColor: 'rgba(243, 139, 168, 0.8)',
      borderColor: 'rgb(243, 139, 168)',
    },
  ];

  const totalSolved = userStats.total_solved || 0;

  const mainStats = [
    {
      name: 'Total Solved',
      stat: totalSolved,
      icon: CheckCircleIcon,
      color: 'bg-[var(--ctp-green-bg)] text-[var(--ctp-green)]',
    },
  ];

  const topTags = Object.entries(userStats.tags_stat || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tagId, count]) => {
      const tag = tags?.data?.find(t => t.id === parseInt(tagId));
      return {
        name: tag?.name || `Tag ${tagId}`,
        count: count || 0,
      };
    });

  if (topTags.length === 0) {
    topTags.push({
      name: 'No Tags',
      count: 0
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {mainStats.map((item) => (
            <div
              key={item.name}
              className="card flex items-center gap-4 p-6 relative"
            >
              <div className={`rounded-lg p-3 ${item.color} flex items-center justify-center`}>
                <item.icon className="h-8 w-8" aria-hidden="true" />
              </div>
              <div>
                <div className="text-lg font-semibold text-[var(--ctp-text)]">{item.name}</div>
                <div className="text-2xl font-bold text-[var(--ctp-blue)] mt-1">{item.stat}</div>
              </div>
            </div>
          ))}

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-[var(--ctp-text)] mb-4">Difficulty Breakdown</h3>
            <div className="grid grid-cols-1 gap-4">
              {difficultyStats.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-4 p-4 bg-[var(--ctp-surface0)] rounded-lg"
                >
                  <div className={`rounded-lg p-2 ${item.color} flex items-center justify-center`}>
                    <ChartBarIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--ctp-subtext0)]">{item.name}</div>
                    <div className="text-xl font-bold text-[var(--ctp-blue)]">{item.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-[var(--ctp-text)] mb-4">Top Tags</h3>
            <div className="grid grid-cols-1 gap-4">
              {topTags.map((tag) => (
                <div
                  key={tag.name}
                  className="flex items-center gap-4 p-4 bg-[var(--ctp-surface0)] rounded-lg"
                >
                  <div className="rounded-lg p-2 bg-[var(--ctp-mauve-bg)] text-[var(--ctp-mauve)] flex items-center justify-center">
                    <TagIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--ctp-subtext0)]">{tag.name}</div>
                    <div className="text-xl font-bold text-[var(--ctp-blue)]">{tag.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <StatsCharts difficultyStats={difficultyStats} topTags={topTags} />
      </div>
    </div>
  );
} 