"use client";

import { useState } from "react";
import type {
  ResumeCustomization,
  ResumeTheme,
  ColorScheme,
  FontFamily,
  SummaryLength,
  ExperienceDetail,
  ResumeLayout,
} from "@/types/resume";

interface ResumeCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (customization: ResumeCustomization) => void;
  loading?: boolean;
}

const THEMES: { id: ResumeTheme; label: string; description: string; accent: string }[] = [
  { id: "modern", label: "Modern", description: "Bold headers, generous whitespace", accent: "bg-indigo-500" },
  { id: "classic", label: "Classic", description: "Traditional, formal layout", accent: "bg-gray-700" },
  { id: "minimal", label: "Minimal", description: "Ultra-clean, content-first", accent: "bg-gray-400" },
  { id: "professional", label: "Professional", description: "Corporate-friendly, structured", accent: "bg-slate-600" },
];

const COLORS: { id: ColorScheme; label: string; hex: string }[] = [
  { id: "blue", label: "Ocean Blue", hex: "#1e40af" },
  { id: "slate", label: "Slate", hex: "#334155" },
  { id: "teal", label: "Teal", hex: "#0f766e" },
];

const FONTS: { id: FontFamily; label: string; sample: string }[] = [
  { id: "inter", label: "Inter", sample: "Clean & Modern" },
  { id: "roboto", label: "Roboto", sample: "Friendly & Readable" },
  { id: "merriweather", label: "Merriweather", sample: "Classic & Elegant" },
  { id: "opensans", label: "Open Sans", sample: "Professional & Clear" },
];

const LAYOUTS: { id: ResumeLayout; label: string; description: string }[] = [
  { id: "header-main", label: "Header + Main", description: "Classic single-column stack" },
  { id: "alternating-blocks", label: "Alternating Blocks", description: "Alternating shade per entry" },
  { id: "card-grid", label: "Card Grid", description: "Card-based entries" },
];

const PAGE_OPTIONS = ["1", "2", "3"] as const;

const SUMMARY_OPTIONS: { id: SummaryLength; label: string; desc: string }[] = [
  { id: "brief", label: "Brief", desc: "1-2 sentences" },
  { id: "standard", label: "Standard", desc: "3-4 sentences" },
  { id: "detailed", label: "Detailed", desc: "Full paragraph" },
];

const EXPERIENCE_OPTIONS: { id: ExperienceDetail; label: string; desc: string }[] = [
  { id: "concise", label: "Concise", desc: "Key highlights only" },
  { id: "standard", label: "Standard", desc: "2-3 bullets per role" },
  { id: "detailed", label: "Detailed", desc: "Full descriptions" },
];

const SECTIONS: { id: keyof Omit<ResumeCustomization["sections"], never>; label: string; defaultOn: boolean }[] = [
  { id: "summary", label: "Professional Summary", defaultOn: true },
  { id: "experience", label: "Work Experience", defaultOn: true },
  { id: "education", label: "Education", defaultOn: true },
  { id: "skills", label: "Skills", defaultOn: true },
  { id: "projects", label: "Projects", defaultOn: true },
  { id: "certifications", label: "Certifications", defaultOn: false },
];

const defaultSections = {
  summary: true,
  experience: true,
  education: true,
  skills: true,
  projects: true,
  certifications: false,
};

export default function ResumeCustomizationModal({
  isOpen,
  onClose,
  onDownload,
  loading = false,
}: ResumeCustomizationModalProps) {
  const [customization, setCustomization] = useState<ResumeCustomization>({
    pageCount: "1",
    theme: "modern",
    layout: "header-main",
    colorScheme: "blue",
    fontFamily: "inter",
    sections: { ...defaultSections },
    summaryLength: "standard",
    experienceDetail: "standard",
  });

  if (!isOpen) return null;

  const toggleSection = (id: keyof Omit<ResumeCustomization["sections"], never>) => {
    setCustomization((c) => ({
      ...c,
      sections: { ...c.sections, [id]: !c.sections[id] },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl mx-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-semibold text-white">Customize Your Resume</h2>
            <p className="text-sm text-gray-400 mt-0.5">Select options before generating your PDF</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-7">

          {/* Page Count */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Page Count</h3>
            <div className="flex gap-3">
              {PAGE_OPTIONS.map((count) => (
                <button
                  key={count}
                  onClick={() => setCustomization((c) => ({ ...c, pageCount: count }))}
                  className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
                    customization.pageCount === count
                      ? "bg-indigo-600 text-white ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-900"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                  }`}
                >
                  {count} Page{count !== "1" ? "s" : ""}
                </button>
              ))}
            </div>
          </section>

          {/* Theme */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Template Theme</h3>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setCustomization((c) => ({ ...c, theme: theme.id }))}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    customization.theme === theme.id
                      ? "bg-indigo-600/20 border-2 border-indigo-500"
                      : "bg-gray-800 border-2 border-transparent hover:bg-gray-750"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg shrink-0 ${theme.accent}`} />
                  <div>
                    <p className="text-sm font-medium text-white">{theme.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{theme.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Layout */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Layout Style</h3>
            <div className="grid grid-cols-3 gap-3">
              {LAYOUTS.map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => setCustomization((c) => ({ ...c, layout: layout.id }))}
                  className={`p-3 rounded-xl text-center transition-all ${
                    customization.layout === layout.id
                      ? "bg-indigo-600 text-white border-2 border-indigo-500"
                      : "bg-gray-800 text-gray-400 border-2 border-transparent hover:bg-gray-750"
                  }`}
                >
                  <p className="text-sm font-medium">{layout.label}</p>
                  <p className="text-xs opacity-60 mt-0.5">{layout.description}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Color Scheme */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Color Scheme</h3>
            <div className="flex gap-3">
              {COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setCustomization((c) => ({ ...c, colorScheme: color.id }))}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                    customization.colorScheme === color.id
                      ? "bg-gray-700"
                      : "bg-gray-800 hover:bg-gray-750"
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-sm text-gray-200">{color.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Font Family */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Font Family</h3>
            <div className="grid grid-cols-2 gap-3">
              {FONTS.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setCustomization((c) => ({ ...c, fontFamily: font.id }))}
                  className={`p-3 rounded-xl text-left transition-all ${
                    customization.fontFamily === font.id
                      ? "bg-indigo-600/20 border-2 border-indigo-500"
                      : "bg-gray-800 border-2 border-transparent hover:bg-gray-750"
                  }`}
                >
                  <p className="text-sm font-medium text-white">{font.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{font.sample}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Sections to Include */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Sections</h3>
            <div className="grid grid-cols-2 gap-2">
              {SECTIONS.map((section) => (
                <label
                  key={section.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/60 hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={customization.sections[section.id] ?? section.defaultOn}
                    onChange={() => toggleSection(section.id)}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-gray-900"
                  />
                  <span className="text-sm text-gray-300">{section.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Summary Length */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Summary Length</h3>
            <div className="flex gap-3">
              {SUMMARY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setCustomization((c) => ({ ...c, summaryLength: opt.id }))}
                  className={`flex-1 py-2.5 rounded-xl text-sm transition-all ${
                    customization.summaryLength === opt.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-750"
                  }`}
                >
                  <span className="block font-medium">{opt.label}</span>
                  <span className="block text-xs opacity-70 mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Experience Detail */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Experience Detail</h3>
            <div className="flex gap-3">
              {EXPERIENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setCustomization((c) => ({ ...c, experienceDetail: opt.id }))}
                  className={`flex-1 py-2.5 rounded-xl text-sm transition-all ${
                    customization.experienceDetail === opt.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-750"
                  }`}
                >
                  <span className="block font-medium">{opt.label}</span>
                  <span className="block text-xs opacity-70 mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>
          </section>

                  </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-800 bg-gray-900 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onDownload(customization)}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Resume
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
