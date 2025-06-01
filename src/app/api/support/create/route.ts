import { NextResponse } from "next/server";

import { createSupportMessage } from "@/data/support-message";

export async function POST(request: Request) {
    try {
        const body: unknown = await request.json();
        if (
            !(
                typeof body === "object" &&
                body !== null &&
                "tgId" in body &&
                typeof body.tgId === "bigint" &&
                "request" in body &&
                typeof body.request === "string"
            )
        ) {
            throw new Error();
        }
        const tgId = body.tgId;
        const request_ = String(body.request);
        await createSupportMessage(tgId, request_);
        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                message: "Ошибка обработки обращения в техподдержку",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 400 },
        );
    }
}
