import { API_BASE, ApiError } from "./api";

const TOKEN_KEY = "jlp_admin_token";
const USER_KEY = "jlp_admin_user";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role:
    | "super_admin"
    | "content_manager"
    | "media_manager"
    | "organization_manager";
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
}

export function storeSession(token: string, user: AdminUser) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export async function loginAdmin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new ApiError(res.status, data?.error || "Login failed");
  }
  storeSession(data.token, data.user);
  return data.user as AdminUser;
}

export async function adminFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token || ""}`,
      ...(init.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    let details: string[] | undefined;
    try {
      const j = await res.json();
      if (j?.error) message = j.error;
      if (Array.isArray(j?.details)) details = j.details;
    } catch {
      /* ignore */
    }
    const err = new ApiError(res.status, message, details);
    if (res.status === 401) clearSession();
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function uploadAdminFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("files", file);
  const data = await adminFetch<{ files: { url: string }[] }>("/upload", {
    method: "POST",
    body: fd,
  });
  const url = data.files?.[0]?.url;
  if (!url) throw new Error("Upload returned no file URL");
  return url;
}