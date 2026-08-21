import {
  getCaseStudy,
  getCompany,
  getPattern,
  getPrimaryCaseStudyForCompany,
  getV2LearningPath,
  getV2LearningPaths,
} from "./content";
import type { V2ContentReference, V2LearningPath } from "./types";

export type PathContentKind = V2ContentReference["type"];

export type ResolvedPathStep = {
  type: PathContentKind;
  slug: string;
  title: string;
  href: string;
  resolvedType: "pattern" | "case-study";
  resolvedSlug: string;
};

export type PathStepNeighbor = {
  path: V2LearningPath;
  stepIndex: number;
  stepCount: number;
  prev: ResolvedPathStep | null;
  next: ResolvedPathStep | null;
  current: ResolvedPathStep;
};

function contentKey(type: PathContentKind, slug: string): string {
  return `${type}:${slug}`;
}

export function resolvePathStep(
  ref: V2ContentReference,
): ResolvedPathStep | null {
  if (ref.type === "pattern") {
    const pattern = getPattern(ref.slug);
    if (!pattern) return null;
    return {
      type: "pattern",
      slug: ref.slug,
      title: ref.title || pattern.name,
      href: `/patterns/${ref.slug}`,
      resolvedType: "pattern",
      resolvedSlug: ref.slug,
    };
  }

  if (ref.type === "case-study") {
    const study = getCaseStudy(ref.slug);
    if (!study) return null;
    return {
      type: "case-study",
      slug: ref.slug,
      title: ref.title || study.title,
      href: `/case-studies/${ref.slug}`,
      resolvedType: "case-study",
      resolvedSlug: ref.slug,
    };
  }

  const company = getCompany(ref.slug);
  const primary = getPrimaryCaseStudyForCompany(ref.slug);
  if (!company || !primary) return null;
  return {
    type: "company",
    slug: ref.slug,
    title: ref.title || company.name,
    href: `/case-studies/${primary.slug}`,
    resolvedType: "case-study",
    resolvedSlug: primary.slug,
  };
}

export function resolvePathContentHref(
  ref: V2ContentReference,
): string | null {
  return resolvePathStep(ref)?.href ?? null;
}

export function getResolvedPathSteps(
  path: V2LearningPath,
): ResolvedPathStep[] {
  return path.contentRefs
    .map((ref) => resolvePathStep(ref))
    .filter((step): step is ResolvedPathStep => Boolean(step));
}

function stepMatchesContent(
  step: ResolvedPathStep,
  type: PathContentKind | "pattern" | "case-study",
  slug: string,
): boolean {
  if (step.type === type && step.slug === slug) return true;
  if (
    (type === "pattern" || type === "case-study") &&
    step.resolvedType === type &&
    step.resolvedSlug === slug
  ) {
    return true;
  }
  return false;
}

export function getPathsContainingContent(
  type: PathContentKind | "pattern" | "case-study",
  slug: string,
): V2LearningPath[] {
  return getV2LearningPaths().filter((path) =>
    path.contentRefs.some((ref) => {
      const step = resolvePathStep(ref);
      return step ? stepMatchesContent(step, type, slug) : false;
    }),
  );
}

/** Paths related to a company via direct refs, primary study, or study patterns. */
export function getLearningPathsForCompany(
  companySlug: string,
): V2LearningPath[] {
  const bySlug = new Map<string, V2LearningPath>();

  for (const path of getPathsContainingContent("company", companySlug)) {
    bySlug.set(path.slug, path);
  }

  const primary = getPrimaryCaseStudyForCompany(companySlug);
  if (primary) {
    for (const path of getPathsContainingContent("case-study", primary.slug)) {
      bySlug.set(path.slug, path);
    }
    for (const patternSlug of primary.patterns) {
      for (const path of getPathsContainingContent("pattern", patternSlug)) {
        bySlug.set(path.slug, path);
      }
    }
  }

  return [...bySlug.values()].sort((a, b) => a.title.localeCompare(b.title));
}

export function getPathStepNeighbors(
  pathSlug: string,
  type: PathContentKind | "pattern" | "case-study",
  slug: string,
): PathStepNeighbor | null {
  const path = getV2LearningPath(pathSlug);
  if (!path) return null;

  const steps = getResolvedPathSteps(path);
  const stepIndex = steps.findIndex((step) =>
    stepMatchesContent(step, type, slug),
  );
  if (stepIndex < 0) return null;

  return {
    path,
    stepIndex,
    stepCount: steps.length,
    prev: stepIndex > 0 ? steps[stepIndex - 1] : null,
    next: stepIndex < steps.length - 1 ? steps[stepIndex + 1] : null,
    current: steps[stepIndex],
  };
}

export function getPathGuidesForContent(
  type: PathContentKind | "pattern" | "case-study",
  slug: string,
): PathStepNeighbor[] {
  return getPathsContainingContent(type, slug)
    .map((path) => getPathStepNeighbors(path.slug, type, slug))
    .filter((guide): guide is PathStepNeighbor => Boolean(guide));
}

export function pathContentRefExists(
  ref: V2ContentReference,
): boolean {
  if (ref.type === "pattern") return Boolean(getPattern(ref.slug));
  if (ref.type === "case-study") return Boolean(getCaseStudy(ref.slug));
  return Boolean(
    getCompany(ref.slug) && getPrimaryCaseStudyForCompany(ref.slug),
  );
}

/** Stable identity for a resolved destination (used by tests / dedupe). */
export function resolvedContentKey(
  type: PathContentKind,
  slug: string,
): string | null {
  const step = resolvePathStep({ type, slug, title: slug });
  if (!step) return null;
  return contentKey(step.resolvedType, step.resolvedSlug);
}
