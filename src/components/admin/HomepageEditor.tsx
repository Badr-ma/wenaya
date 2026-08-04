"use client";

import { useState, useEffect, useCallback } from "react";
import type { HomepageConfig, HomepageSection, SectionType } from "@/lib/homepage-types";
import { SECTION_META } from "@/lib/homepage-types";
import HomepageRenderer from "@/components/homepage/HomepageRenderer";

interface Props {
  token: string;
}

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

export default function HomepageEditor({ token }: Props) {
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch("/api/admin/homepage", token);
      const json = await res.json();
      setConfig(json.data);
    } catch { /* empty */ }
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const saveDraft = async (cfg?: HomepageConfig) => {
    const c = cfg || config;
    if (!c) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await apiFetch("/api/admin/homepage", token, {
        method: "PUT",
        body: JSON.stringify(c),
      });
      setSaveMsg(res.ok ? "Draft saved" : "Error saving");
    } catch {
      setSaveMsg("Network error");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const publish = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await apiFetch("/api/admin/homepage/publish", token, { method: "POST" });
      setSaveMsg(res.ok ? "Published!" : "Error publishing");
    } catch {
      setSaveMsg("Network error");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const resetToDefaults = async () => {
    if (!confirm("Reset all sections to defaults? This cannot be undone.")) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await apiFetch("/api/admin/homepage/reset", token, { method: "POST" });
      const json = await res.json();
      if (json.data) {
        setConfig(json.data);
        setSaveMsg("Defaults restored");
      } else {
        setSaveMsg("Error resetting");
      }
    } catch {
      setSaveMsg("Network error");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const toggleEnabled = (id: string) => {
    if (!config) return;
    const next: HomepageConfig = {
      ...config,
      sections: config.sections.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      ),
    };
    setConfig(next);
  };

  const removeSection = async (id: string) => {
    if (!confirm("Remove this section from homepage?")) return;
    try {
      const res = await apiFetch(`/api/admin/homepage/sections/${id}`, token, { method: "DELETE" });
      const json = await res.json();
      if (json.data) setConfig(json.data);
    } catch { /* empty */ }
  };

  const addSection = async (type: SectionType) => {
    try {
      const res = await apiFetch("/api/admin/homepage/sections", token, {
        method: "POST",
        body: JSON.stringify({ type }),
      });
      const json = await res.json();
      if (json.data) setConfig(json.data);
      setShowAddPanel(false);
    } catch { /* empty */ }
  };

  const updateSectionContent = (id: string, field: string, value: unknown) => {
    if (!config) return;
    const next: HomepageConfig = {
      ...config,
      sections: config.sections.map((s) =>
        s.id === id
          ? ({ ...s, content: { ...s.content, [field]: value } } as HomepageSection)
          : s
      ),
    };
    setConfig(next);
  };

  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx || !config) return;
    const next = [...config.sections];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    const reordered = next.map((s, i) => ({ ...s, order: i }));
    setConfig({ ...config, sections: reordered });
    setDragIdx(idx);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
  };

  const sorted = config
    ? [...config.sections].sort((a, b) => a.order - b.order)
    : [];

  if (loading) {
    return <div className="text-[#2B2F36]/40 text-sm py-12 text-center">Loading homepage config...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-heading font-bold text-[#0B1220]">Homepage</h2>
          <p className="text-xs text-[#2B2F36]/40 mt-0.5">
            {sorted.length} sections &middot; {sorted.filter((s) => s.enabled).length} visible &middot; {sorted.filter((s) => !s.enabled).length} hidden
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saveMsg && (
            <span className={`text-xs ${saveMsg === "Published!" || saveMsg === "Draft saved" || saveMsg === "Defaults restored" ? "text-emerald-600" : "text-red-500"}`}>
              {saveMsg}
            </span>
          )}
          <button
            onClick={resetToDefaults}
            className="px-3 py-2 rounded-lg border border-red-200 text-[11px] font-medium text-red-400 hover:bg-red-50 transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 rounded-lg border border-[#0B1220]/[0.1] text-[12px] font-medium text-[#2B2F36]/60 hover:bg-[#0B1220]/[0.04] transition-colors"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
          <button
            onClick={() => saveDraft()}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-[#0B1220]/[0.06] text-[12px] font-medium text-[#2B2F36]/70 hover:bg-[#0B1220]/[0.1] transition-colors disabled:opacity-40"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={publish}
            disabled={saving}
            className="px-5 py-2 rounded-lg text-[12px] font-semibold text-white transition-all disabled:opacity-40"
            style={{ background: "#B88A5A" }}
          >
            {saving ? "..." : "Publish"}
          </button>
        </div>
      </div>

      {/* Preview mode — renders the actual homepage components inline */}
      {showPreview && config && (
        <div className="border border-[#B88A5A]/20 rounded-xl overflow-hidden">
          <div className="bg-[#B88A5A]/5 px-4 py-2 text-[11px] text-[#B88A5A] font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A]" />
            Preview — draft mode (scroll to see sections)
          </div>
          <div className="max-h-[700px] overflow-y-auto bg-[#F2EFE9]">
            <HomepageRenderer config={config} />
          </div>
        </div>
      )}

      {/* Section list */}
      {!showPreview && (
        <div className="space-y-1.5">
          {sorted.map((section, idx) => {
            const meta = SECTION_META[section.type];
            const isEditing = editingSection === section.id;

            return (
              <div key={section.id}>
                <div
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                    dragIdx === idx
                      ? "border-[#B88A5A]/40 bg-[#B88A5A]/5 shadow-sm"
                      : "border-[#0B1220]/[0.06] bg-white hover:border-[#0B1220]/[0.1]"
                  } ${!section.enabled ? "opacity-50" : ""}`}
                >
                  {/* Drag handle */}
                  <span className="text-[#2B2F36]/20 cursor-grab active:cursor-grabbing text-sm select-none" title="Drag to reorder">
                    ☰
                  </span>

                  {/* Section name */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[13px] font-medium text-[#0B1220]">{meta?.label || section.type}</span>
                    <span className="text-[10px] text-[#2B2F36]/30 ml-2 uppercase tracking-wider">{section.type}</span>
                  </div>

                  {/* Enable/disable */}
                  <button
                    onClick={() => toggleEnabled(section.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all text-xs ${
                      section.enabled
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-[#0B1220]/[0.04] text-[#2B2F36]/30"
                    }`}
                    title={section.enabled ? "Visible" : "Hidden"}
                  >
                    {section.enabled ? "●" : "○"}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => setEditingSection(isEditing ? null : section.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      isEditing
                        ? "bg-[#0B1220] text-white"
                        : "bg-[#0B1220]/[0.04] text-[#2B2F36]/50 hover:bg-[#0B1220]/[0.08]"
                    }`}
                  >
                    {isEditing ? "Close" : "Edit"}
                  </button>

                  {/* Delete */}
                  {!["banner", "hero", "footer"].includes(section.type) && (
                    <button
                      onClick={() => removeSection(section.id)}
                      className="text-[#2B2F36]/20 hover:text-red-500 transition-colors text-xs"
                      title="Remove section"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Inline editor */}
                {isEditing && (
                  <SectionEditor
                    section={section}
                    onUpdate={(field, value) => updateSectionContent(section.id, field, value)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Section */}
      {!showPreview && (
        <div>
          {showAddPanel ? (
            <div className="bg-white rounded-xl border border-[#0B1220]/[0.06] p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] font-medium text-[#0B1220]">Add Section</span>
                <button
                  onClick={() => setShowAddPanel(false)}
                  className="text-[#2B2F36]/30 hover:text-[#2B2F36]/60 text-xs"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {Object.entries(SECTION_META)
                  .filter(([type]) => !["banner", "footer"].includes(type))
                  .map(([type, meta]) => {
                    const alreadyExists = config?.sections.some((s) => s.type === type);
                    return (
                      <button
                        key={type}
                        onClick={() => addSection(type as SectionType)}
                        disabled={alreadyExists}
                        className="text-left p-3 rounded-lg border border-[#0B1220]/[0.06] hover:border-[#B88A5A]/30 hover:bg-[#B88A5A]/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <span className="text-[12px] font-medium text-[#0B1220] block">{meta.label}</span>
                        <span className="text-[10px] text-[#2B2F36]/30 mt-0.5 block leading-tight">{meta.description}</span>
                        {alreadyExists && (
                          <span className="text-[9px] text-amber-500 mt-1 block">Already added</span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddPanel(true)}
              className="w-full py-3 rounded-xl border-2 border-dashed border-[#0B1220]/[0.08] text-[13px] text-[#2B2F36]/30 hover:text-[#B88A5A] hover:border-[#B88A5A]/30 transition-all font-medium"
            >
              + Add Section
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Section Editor ── */

function SectionEditor({
  section,
  onUpdate,
}: {
  section: HomepageSection;
  onUpdate: (field: string, value: unknown) => void;
}) {
  const meta = SECTION_META[section.type];
  const content = (section.content || {}) as Record<string, unknown>;

  const field = (label: string, key: string, opts?: { rows?: number; placeholder?: string }) => (
    <div className="mb-3">
      <label className="block text-[11px] font-medium text-[#2B2F36]/50 mb-1">{label}</label>
      {opts?.rows ? (
        <textarea
          value={String(content[key] ?? "")}
          onChange={(e) => onUpdate(key, e.target.value)}
          rows={opts.rows}
          placeholder={opts.placeholder}
          className="w-full px-3 py-2 rounded-lg border border-[#0B1220]/[0.08] bg-[#FAF8F4] text-[12px] text-[#0B1220] outline-none focus:border-[#B88A5A]/40 transition-colors resize-none"
        />
      ) : (
        <input
          value={String(content[key] ?? "")}
          onChange={(e) => onUpdate(key, e.target.value)}
          placeholder={opts?.placeholder}
          className="w-full px-3 py-2 rounded-lg border border-[#0B1220]/[0.08] bg-[#FAF8F4] text-[12px] text-[#0B1220] outline-none focus:border-[#B88A5A]/40 transition-colors"
        />
      )}
    </div>
  );

  const renderEditor = () => {
    switch (section.type) {
      case "banner":
        return (
          <div className="space-y-2">
            <p className="text-[11px] text-[#2B2F36]/30 italic">Text is managed through i18n translation files.</p>
            {field("Banner text override", "bannerText")}
          </div>
        );

      case "hero":
        return (
          <div className="space-y-2">
            <p className="text-[11px] text-[#2B2F36]/30 italic">Default content is managed through i18n. Override fields below:</p>
            {field("Eyebrow text", "eyebrow")}
            {field("Heading line 1", "heading1")}
            {field("Heading line 2", "heading2")}
            {field("Description", "sub", { rows: 2 })}
            {field("Primary CTA label", "ctaLabel")}
            {field("Primary CTA URL", "ctaUrl")}
            {field("Video URL", "videoUrl")}
          </div>
        );

      case "cta":
        return (
          <div className="space-y-2">
            <p className="text-[11px] text-[#2B2F36]/30 italic">Default content is managed through i18n.</p>
            {field("Heading line 1 override", "heading1")}
            {field("Heading line 2 override", "heading2")}
            {field("Description override", "sub", { rows: 2 })}
            {field("CTA label", "ctaLabel")}
            {field("CTA URL", "ctaUrl")}
          </div>
        );

      case "statistics":
        return (
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-[#0B1220]/[0.02]">
                {field(`Stat ${i + 1} — Value`, `stat_${i}_value`, { placeholder: "e.g. 35" })}
                {field(`Stat ${i + 1} — Label`, `stat_${i}_label`, { placeholder: "e.g. Therapists" })}
              </div>
            ))}
          </div>
        );

      case "image-text":
        return (
          <div className="space-y-2">
            {field("Heading", "heading")}
            {field("Text", "text", { rows: 3 })}
            {field("Image URL", "imageUrl")}
            {field("CTA label", "ctaLabel")}
            {field("CTA URL", "ctaUrl")}
          </div>
        );

      case "full-width-cta":
        return (
          <div className="space-y-2">
            {field("Heading", "heading")}
            {field("Description", "sub", { rows: 2 })}
            {field("CTA label", "ctaLabel")}
            {field("CTA URL", "ctaUrl")}
            {field("Background image URL", "bgImage")}
          </div>
        );

      case "disease-marquee":
        return (
          <div className="space-y-2">
            <p className="text-[11px] text-[#2B2F36]/30 italic">Manage marquee content in the <strong>Specialties</strong> tab.</p>
          </div>
        );

      case "how-it-works":
        return (
          <div className="space-y-2">
            <p className="text-[11px] text-[#2B2F36]/30 italic">The 4 step cards are managed through i18n. Override fields below:</p>
            {field("Badge text", "badge")}
            {field("Heading line 1", "heading1")}
            {field("Heading line 2", "heading2")}
            {field("Description", "sub", { rows: 2 })}
            {field("Primary CTA label", "cta1")}
            {field("Secondary CTA label", "cta2")}
          </div>
        );

      case "biomarkers":
        return (
          <div className="space-y-2">
            <p className="text-[11px] text-[#2B2F36]/30 italic">The 3 pillar cards are managed through i18n. Override fields below:</p>
            {field("Badge text", "badge")}
            {field("Heading line 1", "heading1")}
            {field("Heading line 2", "heading2")}
            {field("Description", "sub", { rows: 2 })}
            {field("Care count label", "soins")}
            {field("Bottom description", "bottom", { rows: 2 })}
            {field("CTA label", "cta")}
          </div>
        );

      case "testimonials":
        return (
          <div className="space-y-2">
            <p className="text-[11px] text-[#2B2F36]/30 italic">Testimonial cards are managed through i18n. Override the heading fields below:</p>
            {field("Heading line 1", "heading1")}
            {field("Heading line 2", "heading2")}
            {field("Description", "sub", { rows: 2 })}
          </div>
        );

      case "expertise":
        return (
          <div className="space-y-2">
            <p className="text-[11px] text-[#2B2F36]/30 italic">Specialist cards are managed through i18n. Override fields below:</p>
            {field("Badge text", "badge")}
            {field("Heading line 1", "heading1")}
            {field("Heading line 2", "heading2")}
            {field("Description", "p1", { rows: 2 })}
            {field("CTA label", "cta")}
          </div>
        );

      case "blog":
        return (
          <div className="space-y-2">
            <p className="text-[11px] text-[#2B2F36]/30 italic">Blog section automatically shows the latest 3 posts.</p>
            {field("Heading line 1 override", "heading1")}
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <p className="text-[11px] text-[#2B2F36]/30 italic">
              This section is rendered with its default content. It has no editable CMS fields yet.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="ml-10 mb-2 mt-1 p-4 rounded-xl bg-[#FAF8F4] border border-[#0B1220]/[0.06]">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[12px] font-medium text-[#0B1220]">{meta?.label || section.type}</span>
        <span className="text-[9px] text-[#2B2F36]/25 uppercase tracking-wider">Editor</span>
      </div>
      {renderEditor()}
    </div>
  );
}
