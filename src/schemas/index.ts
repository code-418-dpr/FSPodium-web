"use client";

import * as z from "zod";

import { UserRole } from "@/app/generated/prisma";

export const PersonalSettingsSchema = z.object({
    name: z.optional(z.string()),
    role: z.enum([UserRole.REGIONAL_REP, UserRole.STRUCTURAL_UNIT]),
    email: z.optional(z.string().email()),
});

export const PasswordSettingsSchema = z
    .object({
        currentPassword: z.optional(z.string().min(6)),
        newPassword: z.optional(z.string().min(6)),
    })
    .refine(
        (data) => {
            return !(data.currentPassword && !data.newPassword);
        },
        {
            message: "Новый пароль обязателен к заполнению",
            path: ["newPassword"],
        },
    )
    .refine(
        (data) => {
            return !(data.newPassword && !data.currentPassword);
        },
        {
            message: "Текущий пароль обязателен к заполнению",
            path: ["currentPassword"],
        },
    );

export const SetPasswordSchema = z
    .object({
        password: z.optional(z.string().min(4, { message: "Пароль должен быть длиннее 4 символов" })),
        repeatPassword: z.optional(z.string().min(4, { message: "Пароль должен быть длиннее 4 символов" })),
    })
    .refine(
        (data) => {
            return data.password === data.repeatPassword;
        },
        {
            message: "Пароли не совпадают",
            path: ["repeatPassword"],
        },
    );


export const RegisterSchema = z.object({
    name: z.string().min(1, {
        message: "Наименование подразделения обязательно к заполнению",
    }),
    address: z.string().min(1, {
        message: "Адрес подразделения обязателен к заполнению",
    }),
    username: z.string().min(1, {
        message: "ФИО руководителя обязательно к заполнению",
    }),
    email: z.string().email({
        message: "Email обязателен к заполнению",
    }),
    phone: z.string().min(10).max(10, {
        message: "Номер телефона обязателен к заполнению",
    }),
});
