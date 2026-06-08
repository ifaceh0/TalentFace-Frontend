import api from '../lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRecruiters: number;
  totalJoinees: number;
  newUsersThisMonth: number;
  newUsersLastMonth: number;
  activeUsersChange: number;
  monthlyGrowth: number[];
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'recruiter' | 'joinee';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  companyName?: string;
}

export interface UsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  pages: number;
}

// ── Admin API calls ───────────────────────────────────────────────────────────

/**
 * GET /api/admin/stats
 */
export const getAdminStats = async (): Promise<AdminStats> => {
  const { data } = await api.get<{ data: AdminStats }>('/admin/stats');
  return data.data;
};

/**
 * GET /api/admin/users?page=1&limit=10&role=recruiter&search=keyword
 */
export const getAdminUsers = async (
  page = 1,
  limit = 10,
  role?: string,
  search?: string
): Promise<UsersResponse> => {
  const params: Record<string, string | number> = { page, limit };
  if (role && role !== 'all') params.role = role;
  if (search && search.trim()) params.search = search.trim();

  const { data } = await api.get<{ data: UsersResponse }>('/admin/users', { params });
  return data.data;
};

/**
 * PATCH /api/admin/users/:id/toggle-status
 * Returns { userId, isActive }
 */
export const toggleUserStatus = async (id: string): Promise<{ userId: string; isActive: boolean }> => {
  const { data } = await api.patch<{ data: { userId: string; isActive: boolean } }>(
    `/admin/users/${id}/toggle-status`
  );
  return data.data;
};

/**
 * DELETE /api/admin/users/:id
 */
export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/admin/users/${id}`);
};
