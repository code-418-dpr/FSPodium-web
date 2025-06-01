"use client";

import { ArrowLeftIcon, TriangleAlertIcon } from "lucide-react";

import { useEffect, useState } from "react";

import Link from "next/link";

import { ResultEvent, Team } from "@/app/generated/prisma";
import { TeamsDisplay } from "@/components/shared/teams-display";
import { buttonVariants } from "@/components/ui/button";
import { getFileBlob } from "@/lib/files";
import { sendFileToParser } from "@/lib/parser";
import { cn } from "@/lib/utils";

interface Props {
    resultFile: ResultEvent | null;
}

export function ResultViewer({ resultFile }: Props) {
    const [data, setData] = useState<unknown>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResult = async () => {
            if (!resultFile) {
                setError("Файл не найден");
                setLoading(false);
                return;
            }
            const blob = await getFileBlob(resultFile.filePath);
            try {
                const formData = new FormData();
                formData.append("file", blob, resultFile.fileName);
                const data = await sendFileToParser(formData);
                const result: unknown = JSON.parse(data);
                setData(result);
                setLoading(false);
            } catch (error) {
                console.error("Error uploading file:", error);
                setError("Ошибка при загрузке файла");
                setLoading(false);
            }
        };
        void fetchResult();
    }, [resultFile]);

    return (
        <div className="relative w-full flex-1">
            <div className="flex flex-col items-center justify-center">
                {loading ? (
                    <p className="mt-52 text-3xl text-gray-300">Загрузка...</p>
                ) : error ? (
                    <div className="border-destructive/60 mt-52 flex items-center gap-x-2 rounded-md border bg-red-600/10 p-3">
                        <TriangleAlertIcon className="h-6 w-6 text-2xl text-red-700" />
                        <p className="text-2xl text-red-700">{error}</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <Link
                            href="/regional"
                            className={cn(buttonVariants({ variant: "outline" }), "absolute top-0 left-4")}
                        >
                            <ArrowLeftIcon className="mr-2 h-4 w-4" />
                            Вернуться назад
                        </Link>
                        <h1 className="mb-6 text-center text-3xl font-bold text-gray-100">
                            Результаты обработки файла {resultFile?.fileName}
                        </h1>
                        {data ? <TeamsDisplay teams={data as Team[]} /> : <p>Loading...</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
