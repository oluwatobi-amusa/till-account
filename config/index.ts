export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://startup-api/api';

export const API_BASE_URL_PROXY = process.env.NEXT_PUBLIC_API_PATH || 'http://localhost:8000/api';

export const PORT = process.env.NEXT_PUBLIC_PORT || 8000;

export const API_PATH = process.env.NEXT_PUBLIC_API_PATH || 'api';

export const API_USER_URL = '/v1';

export const API_AUTH_URL = '/admin/auth';

export const DEFAULT_COUNTRY_PREFIX = '+234';

export const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

export const DEFAULT_CURRENCY = 'NGN';

export const sessionStorageName = 'starter-pack';

export const defaultTTL = 900000;

export const GUEST_ROUTES = ['/', '/login', '/signup'];

export const DASHBOARD_ROUTE = ['/dashboard', '/till-accounts'];
