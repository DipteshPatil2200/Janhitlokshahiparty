"use client";

import * as React from "react";
import {
  FileText,
  Users as UsersIcon,
  Megaphone,
  CalendarDays,
  Video,
  FolderOpen,
  Network,
  Settings as SettingsIcon,
  UserPlus,
  HandHeart,
  MessageSquare,
  LayoutDashboard,
  Image as ImageIcon,
  Link2,
  LogOut,
  ShieldCheck,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { loginAdmin, getStoredUser, clearSession, type AdminUser } from "@/lib/admin";
import { getDashboardStats, type DashboardStats, type CollectionId } from "@/lib/admin-crud";
import { ResourcePanel } from "./resource-panel";
import { GalleryAdmin } from "./gallery-admin";
import { InboxAdmin } from "./inbox-admin";
import { SettingsAdmin } from "./settings-admin";
import { UsersAdmin } from "./users-admin";
import {
  COLLECTIONS,
  allowedCollectionSpecs,
  canViewCollection,
  type Role,
} from "./collections";

type InboxKind = "join" | "volunteer" | "contact";

type ViewId =
  | "dashboard"
  | "gallery"
  | "settings"
  | "users"
  | `collection:${string}`
  | `inbox:${InboxKind}`;

const INBOX_META: Record<InboxKind, { label: string; icon: React.ElementType; endpoint: string }> = {
  join: { label: "Join Requests", icon: UserPlus, endpoint: "/join-requests" },
  volunteer: { label: "Volunteer Requests", icon: HandHeart, endpoint: "/volunteer-requests" },
  contact: { label: "Contact Messages", icon: MessageSquare, endpoint: "/contact-messages" },
};

const COLLECTION_ICON: Record<string, React.ElementType> = {
  news: FileText,
  leaders: UsersIcon,
  campaigns: Megaphone,
  events: CalendarDays,
  videos: Video,
  documents: FolderOpen,
  organization: Network,
  "social-links": Link2,
};

function roleValues(role: Role | undefined): Role[] {
  if (!role) return [];
  if (role === "super_admin") return ["super_admin", "content_manager", "media_manager", "organization_manager"];
  return [role];
}

export function AdminApp() {
  const [user, setUser] = React.useState<AdminUser | null>(null);
const [view, setView] = React.useState<ViewId>("dashboard");
const [hydrated, setHydrated] = React.useState(false);

React.useEffect(() => {
  setUser(getStoredUser());
  setHydrated(true);
}, []);
if (!hydrated) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
    </div>
  );
}
  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  const can = (v: ViewId): boolean => {
    if (user.role === "super_admin") return true;
    const roles = roleValues(user.role);
    if (v === "dashboard" || (v as string).startsWith("inbox:")) return true;
    if (v === "settings") return roles.includes("content_manager");
    if (v === "users") return false;
    if (v === "gallery") return roles.includes("media_manager");
    if ((v as string).startsWith("collection:")) {
      const id = (v as string).replace("collection:", "") as CollectionId;
      return canViewCollection(id, user.role);
    }
    return false;
  };

  interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
  }

  const nav: { section: string; items: NavItem[] }[] = [
    {
      section: "Overview",
      items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }],
    },
    {
      section: "Content",
      items: allowedCollectionSpecs(user.role)
        .filter((c) => c.id !== "organization" && c.id !== "social-links")
        .map((c) => ({
          id: `collection:${c.id}`,
          label: c.label,
          icon: COLLECTION_ICON[c.id],
        })),
    },
    {
      section: "Media",
      items: allowedCollectionSpecs(user.role)
        .filter((c) => c.id === "social-links")
        .map((c) => ({
          id: `collection:${c.id}`,
          label: c.label,
          icon: COLLECTION_ICON[c.id],
        }))
        .concat(
          rolesIncludesMedia(user.role)
            ? [{ id: "gallery", label: "Gallery", icon: ImageIcon }]
            : []
        ),
    },
    {
      section: "Organization",
      items: allowedCollectionSpecs(user.role)
        .filter((c) => c.id === "organization")
        .map((c) => ({
          id: `collection:${c.id}`,
          label: c.label,
          icon: COLLECTION_ICON[c.id],
        })),
    },
    {
      section: "Inbox",
      items: (Object.keys(INBOX_META) as InboxKind[]).map((k) => ({
        id: `inbox:${k}`,
        label: INBOX_META[k].label,
        icon: INBOX_META[k].icon,
      })),
    },
    {
      section: "System",
      items: [
        ...(can("settings")
          ? [{ id: "settings", label: "Settings", icon: SettingsIcon }]
          : []),
        ...(user.role === "super_admin"
          ? [{ id: "users", label: "Users", icon: ShieldCheck }]
          : []),
      ],
    },
  ].filter((g) => g.items.length > 0);

  const activeCollectionId =
    (view as string).startsWith("collection:") ? (view as string).replace("collection:", "") as CollectionId : null;

  return (
    <div className="flex min-h-screen bg-paper">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-white lg:flex">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-white">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-ink">JLP Admin</p>
            <p className="text-[11px] text-ink-muted">Janhit Lokshahi Party</p>
          </div>
        </div>
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {nav.map((group) => (
            <div key={group.section}>
              <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                {group.section}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = view === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setView(item.id as ViewId)}
                      className={[
                        "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium",
                        active
                          ? "bg-brand-50 text-brand-800"
                          : "text-ink-soft hover:bg-stone-100",
                      ].join(" ")}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-border px-5 py-4">
          <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
          <p className="truncate text-xs text-ink-muted">{ROLE_LABELS[user.role] || user.role}</p>
          <div className="mt-3 flex gap-2">
            <a
              href="/"
              className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-ink hover:bg-stone-100"
            >
              <ExternalLink className="h-3 w-3" aria-hidden="true" /> View site
            </a>
            <button
              type="button"
              onClick={() => {
                clearSession();
                setUser(null);
              }}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-3 w-3" aria-hidden="true" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header + main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3 lg:hidden">
          <p className="text-sm font-bold text-ink">JLP Admin</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                clearSession();
                setUser(null);
              }}
              className="rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-red-600"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          {!can(view) ? (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Your role does not permit this section.
            </p>
          ) : activeCollectionId ? (
            <CollectionView id={activeCollectionId} role={user.role} onSelect={setView} />
          ) : view === "gallery" ? (
            <GalleryAdmin />
          ) : (view as string).startsWith("inbox:") ? (
            <InboxAdmin kind={(view as string).replace("inbox:", "") as InboxKind} />
          ) : view === "settings" ? (
            <SettingsAdmin />
          ) : view === "users" ? (
            <UsersAdmin />
          ) : (
            <Dashboard onSelect={setView} />
          )}
        </main>
      </div>
    </div>
  );
}

function rolesIncludesMedia(role: Role | undefined): boolean {
  if (!role) return false;
  if (role === "super_admin") return true;
  return role === "media_manager";
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super admin",
  content_manager: "Content manager",
  media_manager: "Media manager",
  organization_manager: "Organization manager",
};

function LoginScreen({ onLogin }: { onLogin: (u: AdminUser) => void }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700 text-white">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-bold text-ink">JLP Admin</p>
            <p className="text-xs text-ink-muted">Janhit Lokshahi Party</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-white p-6 shadow-card">
          <h1 className="text-lg font-semibold text-ink">Sign in</h1>
          <p className="mt-1 text-sm text-ink-muted">Use your admin account to manage the website.</p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError(null);
              try {
                const u = await loginAdmin(email, password);
                onLogin(u);
              } catch (err: any) {
                setError(err?.message || "Login failed");
              } finally {
                setBusy(false);
              }
            }}
            className="mt-5 space-y-4"
          >
            {error ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            ) : null}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-ink">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30"
                placeholder="admin@janhit.org"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-ink">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              Sign in
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-ink-muted">
          <a href="/" className="underline hover:text-ink">← Back to website</a>
        </p>
      </div>
    </div>
  );
}

function Dashboard({ onSelect }: { onSelect: (v: ViewId) => void }) {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((e: any) => setError(e?.message || "Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  const cards: { label: string; value: number; view: ViewId }[] = stats
    ? [
        { label: "News", value: stats.counts.news, view: "collection:news" },
        { label: "Leaders", value: stats.counts.leaders, view: "collection:leaders" },
        { label: "Campaigns", value: stats.counts.campaigns, view: "collection:campaigns" },
        { label: "Events", value: stats.counts.events, view: "collection:events" },
        { label: "Gallery albums", value: stats.counts.gallery, view: "gallery" },
        { label: "Videos", value: stats.counts.videos, view: "collection:videos" },
        { label: "Documents", value: stats.counts.documents, view: "collection:documents" },
        { label: "Join requests", value: stats.counts.joins, view: "inbox:join" },
        { label: "Volunteers", value: stats.counts.volunteers, view: "inbox:volunteer" },
        { label: "Contact messages", value: stats.counts.contacts, view: "inbox:contact" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-ink">Dashboard</h2>
        <p className="text-sm text-ink-muted">Top-level overview of the content library.</p>
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      {loading ? (
        <p className="text-sm text-ink-muted">Loading stats…</p>
      ) : stats ? (
        <div className="space-y-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">Pending attention</p>
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <span className="rounded-md bg-white px-2.5 py-1 font-medium text-amber-800">
                {stats.pending.pendingJoins} new join requests
              </span>
              <span className="rounded-md bg-white px-2.5 py-1 font-medium text-amber-800">
                {stats.pending.pendingVolunteers} new volunteer requests
              </span>
              <span className="rounded-md bg-white px-2.5 py-1 font-medium text-amber-800">
                {stats.pending.unreadContacts} unread messages
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {cards.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={() => onSelect(c.view)}
                className="rounded-lg border border-border bg-white p-4 text-left shadow-card transition hover:border-brand-300 hover:shadow-md"
              >
                <p className="text-3xl font-bold text-brand-700">{c.value}</p>
                <p className="mt-1 text-xs font-medium text-ink-muted">{c.label}</p>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CollectionView({
  id,
  role,
  onSelect,
}: {
  id: CollectionId;
  role: Role;
  onSelect: (v: ViewId) => void;
}) {
  const spec = COLLECTIONS.find((c) => c.id === id);
  if (!spec) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-ink-muted">Unknown section.</p>
        <button type="button" onClick={() => onSelect("dashboard")} className="text-sm font-semibold text-brand-700">
          ← Back to dashboard
        </button>
      </div>
    );
  }
  if (!canViewCollection(id, role)) {
    return (
      <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
        Your role does not permit this section.
      </p>
    );
  }
  return <ResourcePanel spec={spec} onLocale={() => {}} />;
}