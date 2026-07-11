export const MIN_COMPARE_REPORTS = 2;
export const MAX_COMPARE_REPORTS = 4;

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

export function parseCompareIds(idsParam: string | null | undefined): string[] {
  if (!idsParam) return [];

  const seen = new Set<string>();
  const ids: string[] = [];

  for (const raw of idsParam.split(",")) {
    const id = raw.trim();
    if (!OBJECT_ID_RE.test(id) || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
    if (ids.length >= MAX_COMPARE_REPORTS) break;
  }

  return ids;
}
