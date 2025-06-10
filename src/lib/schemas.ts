import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email обязателен к заполнению",
    }),
    password: z.string().min(1, {
        message: "Пароль обязателен к заполнению",
    }),
});
