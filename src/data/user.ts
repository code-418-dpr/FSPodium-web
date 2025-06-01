"use server";

import { User } from "next-auth";

import { UserRole } from "@/app/generated/prisma";
import db from "@/lib/db";
import { hashPassword } from "@/lib/utils";

export const getUserByEmail = async (email: string) => {
    return db.user.findUnique({ where: { email } });
};

export const getUserById = async (id: string) => {
    return db.user.findUnique({ where: { id } });
};

export const getUserByTgId = async (tgId: bigint) => {
    return db.user.findUnique({ where: { tgId } });
};

export const updateUserTgId = async (id: string, tgId: bigint) => {
    return db.user.update({ where: { id }, data: { tgId } });
};

export const deleteUserTgId = async (tgId: bigint) => {
    return db.user.update({ where: { tgId }, data: { tgId: null } });
};

export const createUser = async (
    name: string,
    phone: bigint,
    email: string,
    password: string,
    role: UserRole = UserRole.STRUCTURAL_UNIT,
    emailNotificationsEnabled = true,
    tgNotificationsEnabled = true,
) => {
    return db.user.create({
        data: {
            name,
            phone,
            email,
            password: await hashPassword(password),
            role,
            emailNotificationsEnabled,
            tgNotificationsEnabled,
        },
    });
};

export const updateUser = async (id: string, name: string, email: string) => {
    return db.user.update({ where: { id }, data: { name, email } });
};

export async function getAdmins() {
    return db.user.findMany({ where: { role: UserRole.REGIONAL_REP } });
}

export const updateUserNotifications = async (
    id: string,
    tgNotificationsEnabled: boolean,
    emailNotificationsEnabled: boolean,
) => {
    return db.user.update({ where: { id }, data: { tgNotificationsEnabled, emailNotificationsEnabled } });
};

export const linkAccount = async (user: User) => {
    return db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
    });
};
