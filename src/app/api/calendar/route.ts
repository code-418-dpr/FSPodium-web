import { NextResponse } from "next/server";

import { EventLevel } from "@/app/generated/prisma";
import { getAndFilterEventsForAll } from "@/data/event";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const levelParam = searchParams.get("level");
        const level =
            levelParam && Object.keys(EventLevel).includes(levelParam)
                ? EventLevel[levelParam as keyof typeof EventLevel]
                : undefined;

        const events = await getAndFilterEventsForAll(level);

        const serializedEvents = serializeBigInt(events);

        return NextResponse.json(serializedEvents, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json(
            {
                message: "Error fetching data",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
        );
    }
}

function serializeBigInt(obj: unknown): unknown {
    if (Array.isArray(obj)) {
        // Рекурсивно обрабатываем массивы
        return obj.map(serializeBigInt);
    } else if (obj instanceof Date) {
        // Если объект является экземпляром Date, возвращаем его как есть
        return obj.toISOString(); // Или просто obj, если хотите сохранить объект Date
    } else if (typeof obj === "object" && obj !== null) {
        // Рекурсивно обрабатываем объекты
        return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, serializeBigInt(value)]));
    } else if (typeof obj === "bigint") {
        // Преобразуем BigInt в строку
        return obj.toString();
    }
    return obj; // Возвращаем значение без изменений
}
