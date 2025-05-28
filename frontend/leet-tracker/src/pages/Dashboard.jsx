import { useQuery } from '@tanstack/react-query';
import UserStats from '../components/UserStats';

export default function Dashboard() {
  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-2xl font-bold text-[var(--ctp-blue)]">Dashboard</h3>
        <p className="mt-2 text-[var(--ctp-subtext0)]">
          Track your LeetCode progress and performance
        </p>
      </div>

      <UserStats />
    </div>
  );
} 