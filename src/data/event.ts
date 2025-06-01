"use server";

import { EventLevel, Status } from "@/app/generated/prisma";
import { createSportObject } from "@/data/sport-object";
import db from "@/lib/db";
import {
    sendEventAcceptedNotification,
    sendEventDeclinedNotification,
    sendNewEventRequestNotification,
} from "@/lib/notifications";

export const createEventRequest = async (
    title: string,
    ageRange: string,
    start: Date,
    end: Date,
    isOnline: boolean,
    level: EventLevel,
    participantsCount: number,
    unitId: string | null = null,
    sportObjectData: { name: string; address: string } | null = null,
    disciplinesIds: string[],
) => {
    let sportObjectsId = null;
    if (sportObjectData) {
        const sportObject = await createSportObject(sportObjectData.name, sportObjectData.address);
        sportObjectsId = sportObject.id;
    }
    const event = await db.event.create({
        data: {
            title,
            ageRange,
            start,
            end,
            isOnline,
            level,
            participantsCount,
            unitId,
            sportObjectsId,
            status: Status.PENDING,
            disciplines: { connect: disciplinesIds.map((id) => ({ id })) },
        },
    });
    await sendNewEventRequestNotification(event.title);
    return event;
};

export const getAndFilterEventsForAll = async (level?: EventLevel) => {
    return db.event.findMany({
        include: {
            unit: {
                include: { user: true },
            },
            sportObject: true,
            disciplines: true,
            resultEvents: true,
        },
        where: { level },
    });
};

export const getAndFilterEventsForMonth = async (year: number, month: number, level?: EventLevel) => {
    const monthStartDate = new Date(year, month - 1, 1);
    const monthEndDate = new Date(year, month, 1);

    return db.event.findMany({
        include: {
            unit: {
                include: { user: true },
            },
            sportObject: true,
            disciplines: true,
        },
        where: {
            start: {
                gte: monthStartDate,
                lt: monthEndDate,
            },
            level,
        },
    });
};

export const getPendingEvents = async () => {
    return db.event.findMany({
        where: {
            status: Status.PENDING,
        },
        include: {
            resultEvents: true,
            unit: true,
            disciplines: true,
            sportObject: true,
        },
    });
};

export const getEventsFromUser = async (userId: string) => {
    return db.event.findMany({
        where: {
            unit: {
                userId,
            },
        },
        include: {
            resultEvents: true,
            unit: true,
            disciplines: true,
            sportObject: true,
        },
    });
};

export const getAllEventsFromUser = async (userId: string) => {
    return db.event.findMany({
        where: {
            unit: { userId },
        },
        include: { unit: true },
    });
};

export const declineEventRequest = async (id: string, refusalReason: string) => {
    const event = await db.event.findUnique({
        where: { id },
        include: {
            unit: {
                include: {
                    user: true,
                },
            },
        },
    });
    if (!event?.unit?.user) {
        throw new Error("Пользователь не найден");
    }

    await sendEventDeclinedNotification(event.unit.user, event.title, refusalReason);

    return db.event.update({
        where: { id },
        data: { status: Status.REFUSED },
    });
};

export const acceptEventRequest = async (id: string) => {
    const event = await db.event.findUnique({
        where: { id },
        include: {
            unit: {
                include: {
                    user: true,
                },
            },
        },
    });
    if (!event?.unit?.user) {
        throw new Error("Пользователь не найден");
    }

    await sendEventAcceptedNotification(event.unit.user, event.title);

    return db.event.update({
        where: { id },
        data: { status: Status.APPROVED },
    });
};
