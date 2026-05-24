import { useState, useEffect, useCallback } from 'react';
import {
  getAdminStats,
  getAdminUsers,
  toggleUserStatus as apiToggle,
  deleteUser as apiDelete,
  type AdminStats,
  type AdminUser,
} from '../../services/admin.service';

export interface UseAdminReturn {
  stats: AdminStats | null;
  users: AdminUser[];
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  statsLoading: boolean;
  error: string | null;
  searchQuery: string;
  roleFilter: string;
  setSearchQuery: (q: string) => void;
  setRoleFilter: (r: string) => void;
  setCurrentPage: (p: number) => void;
  toggleStatus: (id: string) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
  refreshUsers: () => void;
}

export function useAdminData(): UseAdminReturn {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Fetch stats
  useEffect(() => {
    setStatsLoading(true);
    getAdminStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setStatsLoading(false));
  }, []);

  // Fetch users (re-runs on filter/page change)
  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError(null);
    getAdminUsers(currentPage, 10, roleFilter, searchQuery)
      .then((res) => {
        setUsers(res.users);
        setTotalUsers(res.total);
        setTotalPages(res.pages);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [currentPage, roleFilter, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounce search: reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  const toggleStatus = async (id: string) => {
    try {
      const result = await apiToggle(id);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isActive: result.isActive } : u
        )
      );
      // Refresh stats after toggling
      getAdminStats().then(setStats).catch(() => {});
    } catch (e: any) {
      setError(e.message);
    }
  };

  const removeUser = async (id: string) => {
    try {
      await apiDelete(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setTotalUsers((prev) => prev - 1);
      // Refresh stats after deletion
      getAdminStats().then(setStats).catch(() => {});
    } catch (e: any) {
      setError(e.message);
    }
  };

  return {
    stats, users, totalUsers, currentPage, totalPages,
    loading, statsLoading, error,
    searchQuery, roleFilter,
    setSearchQuery, setRoleFilter, setCurrentPage,
    toggleStatus, removeUser, refreshUsers: fetchUsers,
  };
}
