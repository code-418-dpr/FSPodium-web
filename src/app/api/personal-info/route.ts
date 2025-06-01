import { NextResponse } from "next/server";

import { getUserByTgId } from "@/data/user";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const tgId = BigInt(url.searchParams.get("tgId") ?? -1);
        const user = await getUserByTgId(tgId);
        const response = await fetch(process.env.BOT_URL! + "/personal-info/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: tgId,
                name: user!.name,
                email: user!.email,
                role: user!.role,
            }),
        });
        return NextResponse.json({}, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            {
                message: "Ошибка получения персональной информации",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
        );
    }
}
