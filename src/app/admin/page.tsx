/**
 * Admin Dashboard — edit DiseaseMarquee content and specialist profiles.
 * Password-protected. All edits persist to Upstash Redis (if configured).
 * Falls back to hardcoded defaults when Redis is unavailable.
 */
"use client";

import { useState, useEffect, useCallback } from "react";

/* ── Types ── */

interface SpecialtiesData {
  badge: string;
  heading1: string;
  heading2: string;
  sub: string;
  specialites: string[];
  services: string[];
  therapies: string[];
  pillShape?: "pill" | "square" | "rounded";
}

interface SpecialistService {
  id: string;
  title: string;
  duration: string;
  price: string;
  description: string;
  type: "presentiel" | "ligne";
}

interface Specialist {
  slug: string;
  name: string;
  role: string;
  specialty: string;
  image: string;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  languages: string[];
  orderNumber: string;
  bio: string;
  approach: string;
  specialtyTags: string[];
  certifications: string[];
  services: SpecialistService[];
  [key: string]: unknown;
}

/* ── Fetch helpers ── */

async function apiFetch(url: string, token: string, init?: RequestInit) {
  return fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });
}

/* ── List editor ── */

function ListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const addItem = () => {
    const v = draft.trim();
    if (v && !items.includes(v)) {
      onChange([...items, v]);
      setDraft("");
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-[#2B2F36]/60 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0B1220]/[0.04] text-[12px] text-[#2B2F36]/70"
          >
            {item}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="ml-0.5 text-[#2B2F36]/30 hover:text-red-500 transition-colors"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
          placeholder="Add item..."
          className="flex-1 px-3 py-2 rounded-lg border border-[#0B1220]/[0.08] bg-white text-[13px] text-[#0B1220] placeholder-[#2B2F36]/25 outline-none focus:border-[#B88A5A]/40 transition-colors"
        />
        <button
          type="button"
          onClick={addItem}
          className="px-3 py-2 rounded-lg bg-[#0B1220]/[0.04] text-[12px] font-medium text-[#2B2F36]/60 hover:bg-[#0B1220]/[0.08] transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

/* ── Main page ── */

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ username: string; name: string } | null>(null);

  const [tab, setTab] = useState<"marquee" | "specialists">("marquee");

  const [specData, setSpecData] = useState<SpecialtiesData | null>(null);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [dataSource, setDataSource] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  /* Check localStorage for existing token on mount */
  useEffect(() => {
    const stored = localStorage.getItem("wenaya_admin_token");
    const userStr = localStorage.getItem("wenaya_admin_user");
    if (stored) setToken(stored);
    if (userStr) {
      try { setCurrentUser(JSON.parse(userStr)); } catch { /* empty */ }
    }
    setLoading(false);
  }, []);

  const login = async () => {
    setAuthError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      localStorage.setItem("wenaya_admin_token", data.token);
      localStorage.setItem("wenaya_admin_user", JSON.stringify({ username: data.username, name: data.name }));
      setCurrentUser({ username: data.username, name: data.name });
      setToken(data.token);
    } catch {
      setAuthError("Network error");
      setLoading(false);
    }
  };

  const loadAll = useCallback(async (tok: string) => {
    try {
      const [specRes, specialistsRes] = await Promise.all([
        apiFetch("/api/admin/specialties", tok),
        apiFetch("/api/admin/specialists", tok),
      ]);
      const specJson = await specRes.json();
      const specialistsJson = await specialistsRes.json();
      setSpecData(specJson.data);
      setSpecialists(specialistsJson.data);
      setDataSource(specJson.source === "redis" ? "Redis" : "Defaults");
    } catch {
      /* empty */
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) loadAll(token);
  }, [token, loadAll]);

  const saveSpec = async () => {
    if (!token || !specData) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await apiFetch("/api/admin/specialties", token, {
        method: "PUT",
        body: JSON.stringify(specData),
      });
      setSaveMsg(res.ok ? "Saved" : "Error saving");
      if (res.ok) setDataSource("Redis");
    } catch {
      setSaveMsg("Network error");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const saveSpecialists = async () => {
    if (!token) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await apiFetch("/api/admin/specialists", token, {
        method: "PUT",
        body: JSON.stringify(specialists),
      });
      setSaveMsg(res.ok ? "Saved" : "Error saving");
      if (res.ok) setDataSource("Redis");
    } catch {
      setSaveMsg("Network error");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const resetAll = async () => {
    if (!token) return;
    if (!confirm("Reset all edited data to defaults? This cannot be undone.")) return;
    setSaving(true);
    await Promise.all([
      apiFetch("/api/admin/specialties", token, { method: "DELETE" }),
      apiFetch("/api/admin/specialists", token, { method: "DELETE" }),
    ]);
    await loadAll(token);
    setSaveMsg("Reset to defaults");
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const updateSpecField = (field: keyof SpecialtiesData, value: unknown) => {
    if (!specData) return;
    setSpecData({ ...specData, [field]: value });
  };

  const updateSpecialist = (idx: number, field: string, value: unknown) => {
    setSpecialists((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value } as Specialist;
      return next;
    });
  };

  const updateSpecialistService = (specIdx: number, svcIdx: number, field: string, value: string) => {
    setSpecialists((prev) => {
      const next = [...prev];
      const svcs = [...next[specIdx].services];
      svcs[svcIdx] = { ...svcs[svcIdx], [field]: value };
      next[specIdx] = { ...next[specIdx], services: svcs } as Specialist;
      return next;
    });
  };

  /* ── Login screen ── */
  if (!token) {
    return (
      <div className="min-h-screen bg-[#F2EFE9] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-[#0B1220]/[0.06]"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.06)" }}
          >
            <h1 className="text-center font-heading text-[#0B1220] text-2xl font-bold mb-1">Wenaya Admin</h1>
            <p className="text-center text-[#2B2F36]/40 text-xs mb-6">Content management</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                login();
              }}
              className="space-y-4"
            >
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                autoFocus
                className="w-full rounded-xl border border-[#0B1220]/[0.08] bg-white/80 px-4 py-3 text-sm text-[#0B1220] placeholder-[#2B2F36]/25 outline-none focus:border-[#B88A5A]/40 focus:shadow-[0_0_0_3px_rgba(184,138,90,0.08)] transition-all"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-[#0B1220]/[0.08] bg-white/80 px-4 py-3 text-sm text-[#0B1220] placeholder-[#2B2F36]/25 outline-none focus:border-[#B88A5A]/40 focus:shadow-[0_0_0_3px_rgba(184,138,90,0.08)] transition-all"
              />
              {authError && <p className="text-red-500 text-xs">{authError}</p>}
              <button
                type="submit"
                disabled={loading || !username || !password}
                className="w-full h-11 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 4px 16px rgba(184,138,90,0.28)",
                }}
              >
                {loading ? "..." : "Log in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* ── Dashboard ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2EFE9] flex items-center justify-center">
        <p className="text-[#2B2F36]/40 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-[#0B1220]/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-heading font-bold text-[#0B1220]">Wenaya Admin</span>
            {currentUser && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#B88A5A]/10 text-[#B88A5A] font-medium">
                {currentUser.name || currentUser.username}
              </span>
            )}
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#0B1220]/[0.04] text-[#2B2F36]/40">
              {dataSource}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {saveMsg && (
              <span className={`text-xs ${saveMsg === "Saved" ? "text-emerald-600" : "text-[#B88A5A]"}`}>{saveMsg}</span>
            )}
            <button
              onClick={resetAll}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium"
            >
              Reset defaults
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("wenaya_admin_token");
                localStorage.removeItem("wenaya_admin_user");
                window.location.href = "/login";
              }}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-[#0B1220]/[0.04] text-[#2B2F36]/50 hover:bg-[#0B1220]/[0.08] transition-colors font-medium"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-[#0B1220]/[0.03] rounded-xl p-1 w-fit">
          {(["marquee", "specialists"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setSelectedIdx(null); }}
              className={`px-5 py-2 rounded-lg text-[13px] font-medium transition-all ${
                tab === t ? "bg-white text-[#0B1220] shadow-sm" : "text-[#2B2F36]/40 hover:text-[#2B2F36]/60"
              }`}
            >
              {t === "marquee" ? "Disease Marquee" : `Specialists (${specialists.length})`}
            </button>
          ))}
        </div>

        {/* ── Marquee Tab ── */}
        {tab === "marquee" && specData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-[#2B2F36]/60 mb-1.5">Badge text</label>
                <input
                  value={specData.badge}
                  onChange={(e) => updateSpecField("badge", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#0B1220]/[0.08] bg-white text-[13px] text-[#0B1220] outline-none focus:border-[#B88A5A]/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2B2F36]/60 mb-1.5">Heading 1</label>
                <input
                  value={specData.heading1}
                  onChange={(e) => updateSpecField("heading1", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#0B1220]/[0.08] bg-white text-[13px] text-[#0B1220] outline-none focus:border-[#B88A5A]/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2B2F36]/60 mb-1.5">Heading 2 (bronze)</label>
                <input
                  value={specData.heading2}
                  onChange={(e) => updateSpecField("heading2", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#0B1220]/[0.08] bg-white text-[13px] text-[#0B1220] outline-none focus:border-[#B88A5A]/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2B2F36]/60 mb-1.5">Subtitle</label>
                <textarea
                  value={specData.sub}
                  onChange={(e) => updateSpecField("sub", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border border-[#0B1220]/[0.08] bg-white text-[13px] text-[#0B1220] outline-none focus:border-[#B88A5A]/40 transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2B2F36]/60 mb-1.5">Pill shape</label>
                <div className="flex gap-2">
                  {(["pill", "rounded", "square"] as const).map((shape) => (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => updateSpecField("pillShape", shape)}
                      className={`px-4 py-2 text-[12px] font-medium transition-all border ${
                        (specData.pillShape || "pill") === shape
                          ? "bg-[#0B1220] text-white border-[#0B1220]"
                          : "bg-white text-[#2B2F36]/60 border-[#0B1220]/[0.08] hover:border-[#B88A5A]/40"
                      } ${
                        shape === "pill" ? "rounded-full" : shape === "rounded" ? "rounded-lg" : "rounded-none"
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <ListEditor label="Row 1 — Specialités" items={specData.specialites} onChange={(v) => updateSpecField("specialites", v)} />
              <ListEditor label="Row 2 — Services" items={specData.services} onChange={(v) => updateSpecField("services", v)} />
              <ListEditor label="Row 3 — Thérapies" items={specData.therapies} onChange={(v) => updateSpecField("therapies", v)} />
            </div>

            <div className="lg:col-span-2">
              {specData.specialites.length === 0 || specData.services.length === 0 || specData.therapies.length === 0 ? (
                <p className="text-red-500 text-xs">Each row must have at least one item</p>
              ) : null}
              <button
                onClick={saveSpec}
                disabled={saving || specData.specialites.length === 0 || specData.services.length === 0 || specData.therapies.length === 0}
                className="px-6 py-2.5 rounded-full bg-[#0B1220] text-white text-[13px] font-medium hover:bg-[#B88A5A] transition-all disabled:opacity-40"
              >
                {saving ? "Saving..." : "Save marquee"}
              </button>
            </div>
          </div>
        )}

        {/* ── Specialists Tab ── */}
        {tab === "specialists" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar list */}
            <div className="lg:col-span-4 space-y-1">
              <button
                onClick={() => { setSelectedIdx(null); saveSpecialists(); }}
                disabled={saving}
                className="w-full mb-3 px-4 py-2.5 rounded-lg bg-[#0B1220] text-white text-[13px] font-medium hover:bg-[#B88A5A] transition-all disabled:opacity-40"
              >
                {saving ? "Saving..." : "Save all specialists"}
              </button>
              {specialists.map((s, i) => (
                <button
                  key={s.slug}
                  onClick={() => setSelectedIdx(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedIdx === i
                      ? "bg-white shadow-sm border border-[#0B1220]/[0.06]"
                      : "hover:bg-white/50"
                  }`}
                >
                  <p className="text-[13px] font-medium text-[#0B1220]">{s.name}</p>
                  <p className="text-[11px] text-[#2B2F36]/40">{s.role} · {s.specialty}</p>
                </button>
              ))}
            </div>

            {/* Editor */}
            <div className="lg:col-span-8">
              {selectedIdx === null ? (
                <div className="flex items-center justify-center h-64 text-[#2B2F36]/30 text-sm">
                  Select a specialist to edit
                </div>
              ) : (
                <SpecialistEditor
                  specialist={specialists[selectedIdx]}
                  idx={selectedIdx}
                  onUpdate={updateSpecialist}
                  onUpdateService={updateSpecialistService}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Specialist editor form ── */

function SpecialistEditor({
  specialist: s,
  idx,
  onUpdate,
  onUpdateService,
}: {
  specialist: Specialist;
  idx: number;
  onUpdate: (idx: number, field: string, value: unknown) => void;
  onUpdateService: (specIdx: number, svcIdx: number, field: string, value: string) => void;
}) {
  const field = (label: string, field: string, opts?: { rows?: number }) => (
    <div>
      <label className="block text-xs font-medium text-[#2B2F36]/60 mb-1">{label}</label>
      {opts?.rows ? (
        <textarea
          value={String(s[field] ?? "")}
          onChange={(e) => onUpdate(idx, field, e.target.value)}
          rows={opts.rows}
          className="w-full px-3 py-2 rounded-lg border border-[#0B1220]/[0.08] bg-white text-[13px] text-[#0B1220] outline-none focus:border-[#B88A5A]/40 transition-colors resize-none"
        />
      ) : (
        <input
          value={String(s[field] ?? "")}
          onChange={(e) => onUpdate(idx, field, e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-[#0B1220]/[0.08] bg-white text-[13px] text-[#0B1220] outline-none focus:border-[#B88A5A]/40 transition-colors"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Name", "name")}
        {field("Role", "role")}
        {field("Specialty", "specialty")}
        {field("Order #", "orderNumber")}
        {field("Image URL", "image")}
        {field("Rating", "rating")}
        {field("Review count", "reviewCount")}
        {field("Years of experience", "yearsExperience")}
      </div>

      {field("Bio", "bio", { rows: 3 })}
      {field("Approach", "approach", { rows: 3 })}

      <div>
        <label className="block text-xs font-medium text-[#2B2F36]/60 mb-1">Languages (comma-separated)</label>
        <input
          value={Array.isArray(s.languages) ? s.languages.join(", ") : ""}
          onChange={(e) => onUpdate(idx, "languages", e.target.value.split(",").map((l: string) => l.trim()).filter(Boolean))}
          className="w-full px-3 py-2 rounded-lg border border-[#0B1220]/[0.08] bg-white text-[13px] text-[#0B1220] outline-none focus:border-[#B88A5A]/40 transition-colors"
        />
      </div>

      <ListEditor
        label="Specialty tags"
        items={Array.isArray(s.specialtyTags) ? s.specialtyTags : []}
        onChange={(v) => onUpdate(idx, "specialtyTags", v)}
      />

      <ListEditor
        label="Certifications"
        items={Array.isArray(s.certifications) ? s.certifications : []}
        onChange={(v) => onUpdate(idx, "certifications", v)}
      />

      {/* Services */}
      <div>
        <p className="text-xs font-medium text-[#2B2F36]/60 mb-3">Services</p>
        <div className="space-y-3">
          {Array.isArray(s.services) &&
            s.services.map((svc, si) => (
              <div key={svc.id} className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-[#0B1220]/[0.02] border border-[#0B1220]/[0.04]">
                <input
                  value={svc.title}
                  onChange={(e) => onUpdateService(idx, si, "title", e.target.value)}
                  placeholder="Title"
                  className="px-2.5 py-1.5 rounded border border-[#0B1220]/[0.08] bg-white text-[12px] text-[#0B1220] outline-none focus:border-[#B88A5A]/40"
                />
                <input
                  value={svc.duration}
                  onChange={(e) => onUpdateService(idx, si, "duration", e.target.value)}
                  placeholder="Duration"
                  className="px-2.5 py-1.5 rounded border border-[#0B1220]/[0.08] bg-white text-[12px] text-[#0B1220] outline-none focus:border-[#B88A5A]/40"
                />
                <input
                  value={svc.price}
                  onChange={(e) => onUpdateService(idx, si, "price", e.target.value)}
                  placeholder="Price"
                  className="px-2.5 py-1.5 rounded border border-[#0B1220]/[0.08] bg-white text-[12px] text-[#0B1220] outline-none focus:border-[#B88A5A]/40"
                />
                <input
                  value={svc.description}
                  onChange={(e) => onUpdateService(idx, si, "description", e.target.value)}
                  placeholder="Description"
                  className="px-2.5 py-1.5 rounded border border-[#0B1220]/[0.08] bg-white text-[12px] text-[#0B1220] outline-none focus:border-[#B88A5A]/40"
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
