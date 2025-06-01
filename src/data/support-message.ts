"use server";

import db from "@/lib/db";

export const createSupportMessage = async (tgAuthorId: bigint, request: string) => {
    return db.supportMessage.create({ data: { tgAuthorId, request } });
};

export const answerSupportMessage = async (id: string, response: string) => {
    return db.supportMessage.update({ where: { id }, data: { response, solved: true } });
};
