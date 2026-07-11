import CompareView from "./CompareView";
import { parseCompareIds } from "@/lib/compareConfig";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids } = await searchParams;
  return <CompareView ids={parseCompareIds(ids)} />;
}
