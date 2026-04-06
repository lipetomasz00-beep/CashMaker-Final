// src/services/m2m.api.ts
// Money2Money API client (TypeScript)
// Konfiguracja przez ENV:
//  M2M_BASE_URL (default: https://api.money2money.com.pl)
//  M2M_LOGIN
//  M2M_PASSWORD
//  M2M_TOKEN_TTL_MS (optional, default 55min)
//  M2M_TIMEOUT_MS (optional, default 8000ms)

const BASE = (process.env.M2M_BASE_URL || 'https://api.money2money.com.pl').replace(/\/$/,'');
const LOGIN = process.env.M2M_LOGIN || '';
const PASSWORD = process.env.M2M_PASSWORD || '';
const TOKEN_TTL = Number(process.env.M2M_TOKEN_TTL_MS || 55 * 60 * 1000);
const TIMEOUT = Number(process.env.M2M_TIMEOUT_MS || 8000);

let cachedToken: string | null = null;
let tokenObtainedAt = 0;

async function fetchJson(url: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    clearTimeout(id);
    const text = await res.text();
    const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : {};
    if (!res.ok) {
      const e: any = new Error(`HTTP ${res.status} ${res.statusText}`);
      e.status = res.status;
      e.body = data;
      throw e;
    }
    return data;
  } finally {
    clearTimeout(id);
  }
}

async function authorize(): Promise<string> {
  if (cachedToken && (Date.now() - tokenObtainedAt) < TOKEN_TTL) return cachedToken;
  if (!LOGIN || !PASSWORD) throw new Error('M2M_LOGIN and M2M_PASSWORD must be set in env');

  const url = `${BASE}/authorization`;
  const data: any = await fetchJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: LOGIN, password: PASSWORD })
  });

  const token = data?.token || data?.access_token || null;
  if (!token) throw new Error('Authorization failed: token not returned');
  cachedToken = token;
  tokenObtainedAt = Date.now();
  console.info('m2m.api: obtained token');
  return token;
}

async function requestWithAuth(path: string, opts: RequestInit = {}, retry = true) {
  const token = await authorize();
  const url = path.startsWith('http') ? path : `${BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers = Object.assign({}, opts.headers || {}, {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
  try {
    return await fetchJson(url, { ...opts, headers });
  } catch (err: any) {
    if ((err.status === 401 || err.status === 403) && retry) {
      cachedToken = null;
      const token2 = await authorize();
      const headers2 = Object.assign({}, opts.headers || {}, {
        Authorization: `Bearer ${token2}`,
        'Content-Type': 'application/json'
      });
      return await fetchJson(url, { ...opts, headers: headers2 });
    }
    throw err;
  }
}

export const m2mApi = {
  async getApplications(params: { from?: string; to?: string; sortBy?: string; page?: number; per_page?: number } = {}): Promise<any> {
    const qs = new URLSearchParams();
    if (params.from) qs.set('from', params.from);
    if (params.to) qs.set('to', params.to);
    if (params.sortBy) qs.set('sortBy', params.sortBy);
    if (params.page) qs.set('page', String(params.page));
    if (params.per_page) qs.set('per_page', String(params.per_page));
    const path = `/application${qs.toString() ? '?' + qs.toString() : ''}`;
    return await requestWithAuth(path, { method: 'GET' });
  },

  async getApplication(applicationId: string): Promise<any> {
    const path = `/application/${encodeURIComponent(applicationId)}`;
    return await requestWithAuth(path, { method: 'GET' });
  },

  async getProvisionList(params: { from?: string; to?: string; type?: string; sortBy?: string; page?: number; per_page?: number } = {}): Promise<any> {
    const qs = new URLSearchParams();
    if (params.from) qs.set('from', params.from);
    if (params.to) qs.set('to', params.to);
    if (params.sortBy) qs.set('sortBy', params.sortBy);
    if (params.type) qs.set('type', params.type);
    if (params.page) qs.set('page', String(params.page));
    if (params.per_page) qs.set('per_page', String(params.per_page));
    const path = `/provision${qs.toString() ? '?' + qs.toString() : ''}`;
    return await requestWithAuth(path, { method: 'GET' });
  },

  async getProvisionByApplication(applicationId: string): Promise<any> {
    const path = `/provision/${encodeURIComponent(applicationId)}`;
    return await requestWithAuth(path, { method: 'GET' });
  }
};