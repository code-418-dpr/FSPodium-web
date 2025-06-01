"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";

import { getServerSession } from "next-auth";

import { getUserByEmail, getUserById } from "@/data/user";
import db from "@/lib/db";
import { PasswordSettingsSchema, PersonalSettingsSchema } from "@/schemas";

export const setPersonalSettings = async (values: z.infer<typeof PersonalSettingsSchema>) => {
    const session = await getServerSession();
    const user = session?.user;

    if (!user) {
        return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
        return { error: "Unauthorized" };
    }

    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);

        if (existingUser && existingUser.id !== user.id) {
            return { error: "Email уже используется!" };
        }
    }

    const updatedUser = await db.user.update({
        where: { id: dbUser.id },
        data: {
            ...values,
        },
    });

    session.user.name = updatedUser.name;
    session.user.email = updatedUser.email;
    session.user.role = updatedUser.role;

    return { success: "Настройки успешно обновлены!" };
};

export const setPasswordSettings = async (values: z.infer<typeof PasswordSettingsSchema>) => {
    const session = await getServerSession();
    const user = session?.user;

    if (!user) {
        return { error: "Unauthorized" };
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
        return { error: "Unauthorized" };
    }

    if (values.currentPassword && values.newPassword && dbUser.password) {
        const passwordsMatch = await bcrypt.compare(values.currentPassword, dbUser.password);

        if (!passwordsMatch) {
            return { error: "Неверный пароль!" };
        }

        values.currentPassword = await bcrypt.hash(values.newPassword, 10);
    }

    await db.user.update({
        where: { id: dbUser.id },
        data: {
            password: values.currentPassword,
        },
    });

    return { success: "Пароль успешно изменен!" };
};
