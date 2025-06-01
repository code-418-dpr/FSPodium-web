"use server";

import db from "@/lib/db";

export const getAllDisciplines = async () => {
    return db.discipline.findMany();
};

export const createDiscipline = async (id: string, name: string) => {
    return db.discipline.create({ data: { id, name } });
};
