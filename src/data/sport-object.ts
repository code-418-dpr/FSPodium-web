"use server";

import db from "@/lib/db";

export const createSportObject = async (name: string, address: string) => {
    return db.sportObject.create({ data: { name, address } });
};
