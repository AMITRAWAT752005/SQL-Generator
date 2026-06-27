export interface ApiErrorResponse {
  message?: string;
  error?: string;
  details?: unknown;
}

export const ENABLE_MOCK = import.meta.env.VITE_ENABLE_MOCK === 'true';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const getAuthToken = (): string | null => {
  const session = localStorage.getItem('sql_gen_session');
  if (!session) return null;

  try {
    const parsed = JSON.parse(session) as { token?: string };
    return parsed.token ?? null;
  } catch {
    return null;
  }
};

const defaultHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const buildUrl = (path: string, query?: Record<string, string | number | boolean>) => {
  const base = path.startsWith('http')
    ? path
    : `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

  if (!query || Object.keys(query).length === 0) {
    return base;
  }

  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    searchParams.set(key, String(value));
  });

  return `${base}?${searchParams.toString()}`;
};

const handleResponse = async (response: Response) => {
  const text = await response.text();
  let data: any;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const errorMessage = data?.message || data?.error || text || response.statusText;
    throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
  }

  return data;
};

const request = async <T>(method: string, path: string, body?: any, query?: Record<string, any>) => {
  if (!API_BASE_URL && !path.startsWith('http')) {
    throw new Error('API base URL is not configured. Set VITE_API_BASE_URL in your environment.');
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: defaultHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  return handleResponse(response) as Promise<T>;
};

export const apiClient = {
  isMockEnabled: (): boolean => ENABLE_MOCK,
  get: <T>(path: string, query?: Record<string, any>) => request<T>('GET', path, undefined, query),
  post: <T>(path: string, body?: any) => request<T>('POST', path, body),
  put: <T>(path: string, body?: any) => request<T>('PUT', path, body),
  del: <T>(path: string, body?: any) => request<T>('DELETE', path, body),
  buildUrl,
};
