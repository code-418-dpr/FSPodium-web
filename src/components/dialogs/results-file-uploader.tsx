import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploader } from "@/components/ui/file-uploader";
import { addResultEventFile } from "@/data/result-event";
import { getStructuralUnits } from "@/data/structural-unit";
import { useAuth } from "@/hooks/use-auth";

interface Props {
    eventId: string;
    setOpen: (open: boolean) => void;
}

export function ResultsFileUploader({ eventId, setOpen }: Props) {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [, setFileNames] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const handleFileUpload = (files: File[]) => {
        setUploadedFiles(files);
        setFileNames(files.map((file) => file.name));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let representationIdForUser = null;

        // Проверка файлов перед загрузкой
        if (uploadedFiles.length === 0) {
            console.error("Нет файлов для загрузки");
            return;
        }
        setIsLoading(true);
        try {
            // Получаем ID представления пользователя
            try {
                const response = await getStructuralUnits();
                const result = response
                    .map((representation: { userId: string; id: string }) => {
                        return representation.userId === user?.id ? representation.id : null;
                    })
                    .filter(Boolean);
                representationIdForUser = result[0] ?? null;
            } catch (error) {
                console.error("Ошибка при получении представлений:", error);
                return;
            }

            // Загрузка файлов по одному
            for (const file of uploadedFiles) {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const base64String = Buffer.from(arrayBuffer).toString("base64");

                    await addResultEventFile(
                        eventId,
                        [base64String], // Загружаем только один файл за раз
                        file.name, // Имя текущего файла
                        representationIdForUser,
                    );
                } catch (error) {
                    console.error(`Ошибка при загрузке файла ${file.name}:`, error);
                }
            }

            // Закрываем модальное окно после успешной загрузки
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Ошибка во время загрузки файлов:", error);
        } finally {
            setIsLoading(false); // Сбрасываем состояние загрузки
        }
    };
    return (
        <div className="space-y-6">
            <Card className="border-none p-0 shadow-none">
                <CardHeader>
                    <CardTitle>Загрузка итоговых протоколов</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <form
                        className="space-y-4"
                        onSubmit={(e) => {
                            void handleSubmit(e);
                        }}
                    >
                        <FileUploader
                            value={uploadedFiles} // Передаем текущие файлы
                            onValueChange={handleFileUpload} // Обработчик изменения файлов
                            maxSize={1024 * 1024 * 10}
                        />
                        <Button type="submit" disabled={isLoading}>
                            Подтвердить загрузку
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
