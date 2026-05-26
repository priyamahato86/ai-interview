import { z } from "zod"

export const resumeThemeSchema = z.enum(["modern", "classic", "minimal", "professional"])
export type ResumeTheme = z.infer<typeof resumeThemeSchema>

export const resumeLayoutSchema = z.enum(["header-main", "alternating-blocks", "card-grid"])
export type ResumeLayout = z.infer<typeof resumeLayoutSchema>

export const colorSchemeSchema = z.enum(["blue", "slate", "teal"])
export type ColorScheme = z.infer<typeof colorSchemeSchema>

export const fontFamilySchema = z.enum(["inter", "roboto", "merriweather", "opensans"])
export type FontFamily = z.infer<typeof fontFamilySchema>

export const summaryLengthSchema = z.enum(["brief", "standard", "detailed"])
export type SummaryLength = z.infer<typeof summaryLengthSchema>

export const experienceDetailSchema = z.enum(["concise", "standard", "detailed"])
export type ExperienceDetail = z.infer<typeof experienceDetailSchema>

export const sectionOptionSchema = z.object({
  summary: z.boolean().default(true),
  experience: z.boolean().default(true),
  education: z.boolean().default(true),
  skills: z.boolean().default(true),
  projects: z.boolean().default(true),
  certifications: z.boolean().default(false),
})
export type SectionOptions = z.infer<typeof sectionOptionSchema>

export const resumeCustomizationSchema = z.object({
  pageCount: z.enum(["1", "2", "3"]).default("1"),
  theme: resumeThemeSchema.default("modern"),
  layout: resumeLayoutSchema.default("header-main"),
  colorScheme: colorSchemeSchema.default("blue"),
  fontFamily: fontFamilySchema.default("inter"),
  sections: sectionOptionSchema,
  summaryLength: summaryLengthSchema.default("standard"),
  experienceDetail: experienceDetailSchema.default("standard"),
})
export type ResumeCustomization = z.infer<typeof resumeCustomizationSchema>
