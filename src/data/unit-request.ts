"use server";

import { Status } from "@/app/generated/prisma";
import db from "@/lib/db";
import { sendUnitAcceptedEmail, sendUnitDeclinedEmail, sendUnitRequestNotification } from "@/lib/notifications";

export async function getStructuralUnitRequest(id: string) {
    return db.unitRequest.findUnique({ where: { id } });
}

export const applyStructuralUnitRequest = async (
    name: string,
    address: string,
    username: string,
    email: string,
    phone: number,
) => {
    await sendUnitRequestNotification(name, address);

    return db.unitRequest.create({
        data: { name, address, username, email, phone },
    });
};

export const adminChangeRepresentationRequestStatus = async (
    unitRequestId: string,
    approve: boolean,
    refusalReason?: string,
) => {
    const unitRequest = await getStructuralUnitRequest(unitRequestId);

    if (!unitRequest) {
        throw new Error("Заявка не найдена");
    }

    if (refusalReason) {
        await sendUnitDeclinedEmail(unitRequest.email, refusalReason);
    } else {
        await sendUnitAcceptedEmail(unitRequest.email, `${process.env.WEB_URL}/set-password/${unitRequestId}`);
    }

    return db.unitRequest.update({
        where: { id: unitRequestId },
        data: {
            status: approve ? Status.APPROVED : Status.REFUSED,
            refusalReason,
        },
    });
};

export const getAllUnitRequests = async () => {
    return db.unitRequest.findMany();
};
