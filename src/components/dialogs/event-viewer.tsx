import { FileText } from "lucide-react";

import Link from "next/link";

import { LevelBadge } from "@/components/badges/level-badge";
import { StatusBadge } from "@/components/badges/status-badge";
import { ResultsFileUploader } from "@/components/dialogs/results-file-uploader";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ExtendedEvent } from "@/prisma/types";

import { buttonVariants } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PdfDialog } from "./pdf-dialog";

interface EventViewerProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    event: ExtendedEvent | null;
    isAdmin: boolean;
}

export function EventViewer({ open, setOpen, event, isAdmin }: EventViewerProps) {
    if (!event) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className={cn(
                    "flex max-w-4xl flex-col overflow-y-auto",
                    event.status === "APPROVED" ? "h-[80vh]" : event.status === "COMPLETED" ? "h-[80vh]" : "h-[35vh]",
                )}
            >
                <DialogHeader>
                    <DialogTitle>{event.title}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-3">
                    <div>
                        Уровень: <LevelBadge level={event.level} />
                    </div>
                    <div>Начало: {new Date(event.start).toLocaleDateString()}</div>
                    <div>Конец: {new Date(event.end).toLocaleDateString()}</div>
                    <div>Онлайн: {event.isOnline ? "Да" : "Нет"}</div>
                    {!event.isOnline && <div>Место проведения: {event.sportObject?.name}</div>}
                    <div>
                        Статус: <StatusBadge status={event.status} />
                    </div>
                    {event.disciplines.length > 0 && (
                        <div>Дисциплины: {event.disciplines.map((discipline) => discipline.name).join(", ")}</div>
                    )}
                </div>
                {((!isAdmin && event.status === "APPROVED") || event.status === "COMPLETED") && (
                    <div className="mt-2 flex flex-col gap-2">
                        <p className="text-lg font-bold">Файлы</p>
                        <Tabs defaultValue="files" className="flex-1">
                            <TabsList>
                                <TabsTrigger value="files">Загруженные файлы</TabsTrigger>
                                <TabsTrigger value="add-files">Добавить файлы</TabsTrigger>
                            </TabsList>
                            <TabsContent value="files">
                                <div className="space-y-4">
                                    {event.resultEvents.length > 0 ? (
                                        <div className="grid gap-4">
                                            {event.resultEvents.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between rounded-lg border p-4"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-5 w-5 text-gray-500" />
                                                        <span className="font-medium">{file.fileName}</span>
                                                    </div>
                                                    {file.fileName.endsWith(".pdf") ? (
                                                        <PdfDialog file={file} />
                                                    ) : file.fileName.endsWith(".docx") ? (
                                                        <Link
                                                            href={`/result?id=${file.id}`}
                                                            className={cn(
                                                                buttonVariants({
                                                                    variant: "outline",
                                                                }),
                                                            )}
                                                        >
                                                            Получить данные результатов
                                                        </Link>
                                                    ) : (
                                                        <span className="rounded-lg bg-red-700 px-2 py-1">
                                                            Временно недоступно
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500">Нет загруженных файлов</p>
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent value="add-files">
                                <ResultsFileUploader eventId={event.id} setOpen={setOpen} />
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
