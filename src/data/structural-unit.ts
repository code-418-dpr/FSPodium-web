"use server";

import db from "@/lib/db";

export const createStructuralUnit = async (name: string, address: string, userId: string) => {
    return db.unit.create({
        data: {
            name,
            address,
            userId,
        },
    });
};

export const getStructuralUnits = async () => {
    return db.unit.findMany({ include: { user: true } });
};

export const getStructuralUnitByUserId = async (userId: string) => {
    return db.unit.findFirst({
        where: { userId },
        include: { user: true },
    });
};
