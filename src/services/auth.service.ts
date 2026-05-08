import api from '../lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'recruiter' | 'joinee';
  isActive: boolean;
  lastLogin?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface RecruiterSignupPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  companyWebsite?: string;
  designation?: string;
  phone?: string;
}

export interface JoineeSignupPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Persist token so the request interceptor can attach it on subsequent calls. */
export const saveToken = (token: string) =>
  localStorage.setItem('tf_token', token);

export const clearToken = () => localStorage.removeItem('tf_token');

// ── Auth calls ────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 */
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await api.post<{ data: AuthResponse }>('/auth/login', {
    email,
    password,
  });
  return data.data;
};

/**
 * POST /api/auth/signup/recruiter
 */
export const signupRecruiter = async (
  payload: RecruiterSignupPayload
): Promise<AuthResponse> => {
  const { data } = await api.post<{ data: AuthResponse }>(
    '/auth/signup/recruiter',
    payload
  );
  return data.data;
};

/**
 * POST /api/auth/signup/joinee
 */
export const signupJoinee = async (
  payload: JoineeSignupPayload
): Promise<AuthResponse> => {
  const { data } = await api.post<{ data: AuthResponse }>(
    '/auth/signup/joinee',
    payload
  );
  return data.data;
};

/**
 * POST /api/auth/logout
 */
export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

/**
 * GET /api/auth/me
 */
export const getMe = async (): Promise<AuthUser> => {
  const { data } = await api.get<{ data: { user: AuthUser } }>('/auth/me');
  return data.data.user;
};
