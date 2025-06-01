import { ResultViewer } from "@/components/shared/result-viewer";
import { getResultEventById } from "@/data/result-event";

export default async function ResultPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const id = (await searchParams).id as string;
    const resultEvent = await getResultEventById(id);
    return <ResultViewer resultFile={resultEvent} />;
}
