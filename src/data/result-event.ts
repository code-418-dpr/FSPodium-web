"use server";

import db from "@/lib/db";

export const getAllResultEvents = async () => {
    return db.resultEvent.findMany();
};

export const addResultEventFile = async (
    eventId: string,
    files: string[], // Массив файлов в формате Base64
    fileName: string,
    unitId: string | null = null, // Параметр по умолчанию
) => {
    try {
        // Проходим по массиву файлов и сохраняем каждый
        for (const fileBase64 of files) {
            const fileBuffer = Buffer.from(fileBase64, "base64"); // Декодируем файл из Base64

            const formData = new FormData();
            formData.append("file", new Blob([fileBuffer]), fileName);

            const response = await fetch(`${process.env.FILE_SERVICE_URL}/api/Files?bucketName=files`, {
                method: "POST",
                body: formData,
            });

            const data: unknown = await response.json();
            console.log(data);
            if (
                !data ||
                typeof data !== "object" ||
                !("value" in data) ||
                !data.value ||
                !Array.isArray(data.value) ||
                typeof data.value[0] !== "string"
            ) {
                throw new Error();
            }
            const filePath = data.value[0];
            console.log(filePath);

            console.log("Размер файла (байты):", fileBuffer.length);
            await db.resultEvent.create({
                data: {
                    eventId,
                    unitId,
                    fileName,
                    filePath,
                },
            });
        }

        console.log("Все файлы успешно добавлены");
    } catch (error) {
        console.error("Ошибка при добавлении файлов:", error);
        throw new Error("Не удалось добавить файлы");
    }
};

export const getResultEventById = async (id: string) => {
    return db.resultEvent.findUnique({ where: { id } });
};
