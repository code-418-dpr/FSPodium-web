"use server";

import { NextResponse } from "next/server";

import { acceptEventRequest, declineEventRequest } from "@/data/event";
import { adminChangeRepresentationRequestStatus } from "@/data/unit-request";

export async function POST(request: Request) {
    try {
        const data: unknown = await request.json();
        if (
            !(
                typeof data === "object" &&
                data !== null &&
                "requestId" in data &&
                "type" in data &&
                "refusalReason" in data &&
                typeof data.requestId === "string" &&
                typeof data.refusalReason === "string"
            )
        ) {
            throw new Error();
        }
        const { requestId, type, refusalReason } = data;
        if (!requestId || !type) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        if (type === "representation") {
            if (refusalReason) {
                await adminChangeRepresentationRequestStatus(requestId, false, refusalReason);
            } else {
                await adminChangeRepresentationRequestStatus(requestId, true);
            }
        } else if (type === "event") {
            if (refusalReason) {
                await declineEventRequest(requestId, refusalReason);
            } else {
                await acceptEventRequest(requestId);
            }
        }
        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                message: "Error updating request",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
        );
    }
}
