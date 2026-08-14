import { z } from "zod";

export const difficultySchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
]);

export const slugSchema = z
  .string()
  .trim()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Must be kebab-case (e.g. load-balancing)",
  );

const isoDateSchema = z.preprocess((value) => {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }
  return value;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD"));

export const prerequisiteSchema = z.object({
  type: z.enum(["pattern", "case-study"]),
  slug: slugSchema,
});

export const learningMetadataSchema = z.object({
  difficulty: difficultySchema,
  prerequisites: z.array(prerequisiteSchema),
  estimatedReadingMinutes: z.coerce.number().int().positive(),
  learningObjectives: z.array(z.string().trim().min(1)).min(2).max(6),
});

export const companyFrontmatterSchema = z.object({
  name: z.string().trim().min(1),
  slug: slugSchema,
  logo: z.string().trim().min(1),
  industry: z.string().trim().min(1),
  scale: z.string().trim().min(1),
  techStack: z.array(z.string().trim().min(1)),
  summary: z.string().trim().min(1),
  popularity: z.number(),
  updatedAt: isoDateSchema,
});

export const patternFrontmatterSchema = z
  .object({
    name: z.string().trim().min(1),
    slug: slugSchema,
    icon: z.string().trim().min(1),
    definition: z.string().trim().min(1),
    relatedPatterns: z.array(slugSchema),
    publishedAt: isoDateSchema,
  })
  .merge(learningMetadataSchema);

export const caseStudyStatsSchema = z.object({
  users: z.string().trim().min(1),
  rps: z.string().trim().min(1),
  dataVolume: z.string().trim().min(1),
  regions: z.string().trim().min(1),
});

export const caseStudyFrontmatterSchema = z
  .object({
    title: z.string().trim().min(1),
    slug: slugSchema,
    company: slugSchema,
    patterns: z.array(slugSchema),
    stats: caseStudyStatsSchema,
    featured: z.boolean(),
    publishedAt: isoDateSchema,
    updatedAt: isoDateSchema,
    relatedCompanies: z.array(slugSchema),
    hook: z.string().trim().min(1),
  })
  .merge(learningMetadataSchema);

export type Difficulty = z.infer<typeof difficultySchema>;
export type PrerequisiteRef = z.infer<typeof prerequisiteSchema>;
export type CompanyFrontmatter = z.infer<typeof companyFrontmatterSchema>;
export type PatternFrontmatter = z.infer<typeof patternFrontmatterSchema>;
export type CaseStudyFrontmatter = z.infer<typeof caseStudyFrontmatterSchema>;
export type CaseStudyStats = z.infer<typeof caseStudyStatsSchema>;

export type ValidationIssue = {
  file: string;
  path: string;
  message: string;
};

export function zodErrorToIssues(
  file: string,
  error: z.ZodError,
): ValidationIssue[] {
  return error.issues.map((issue) => ({
    file,
    path: issue.path.length > 0 ? issue.path.join(".") : "frontmatter",
    message: issue.message,
  }));
}

export function parseFrontmatter<T>(
  schema: z.ZodType<T, z.ZodTypeDef, unknown>,
  data: unknown,
  filePath: string,
): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const details = zodErrorToIssues(filePath, parsed.error)
      .map((issue) => `  ${issue.path}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in ${filePath}:\n${details}`);
  }
  return parsed.data;
}
