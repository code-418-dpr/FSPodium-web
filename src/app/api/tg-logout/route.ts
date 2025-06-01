import { NextResponse } from "next/server";

import { deleteUserTgId } from "@/data/user";

export async function POST(request: Request) {
    try {
        const data: unknown = await request.json();
        if (!(typeof data === "object" && data !== null && "tgId" in data && typeof data.tgId === "bigint")) {
            throw new Error("Wrong JSON format");
        }
        await deleteUserTgId(data.tgId);
        return NextResponse.json({ message: "OK" });
    } catch (error) {
        return NextResponse.json(
            {
                message: "Ошибка выхода из аккаунта",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 400 },
        );
    }
}
