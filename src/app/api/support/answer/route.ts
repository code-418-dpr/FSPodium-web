import { NextResponse } from "next/server";

import { answerSupportMessage } from "@/data/support-message";

export async function POST(request: Request) {
    try {
        const body: unknown = await request.json();
        if (
            !(
                typeof body === "object" &&
                body !== null &&
                "supportMessageId" in body &&
                "response" in body &&
                typeof body.supportMessageId === "string" &&
                typeof body.response === "string"
            )
        ) {
            throw new Error();
        }
        const supportMessageId = body.supportMessageId;
        const response = body.response;
        await answerSupportMessage(supportMessageId, response);
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
