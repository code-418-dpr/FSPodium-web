"use client";

import * as z from "zod";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { FormFeedback } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createStructuralUnit } from "@/data/structural-unit";
import { adminChangeRepresentationRequestStatus, getStructuralUnitRequest } from "@/data/unit-request";
import { createUser } from "@/data/user";
import { SetPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
    requestId: string;
}

export const SetPasswordForm = ({ requestId }: Props) => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof SetPasswordSchema>>({
        resolver: zodResolver(SetPasswordSchema),
        defaultValues: {
            password: "",
            repeatPassword: "",
        },
    });

    const onSubmit = (values: z.infer<typeof SetPasswordSchema>) => {
        startTransition(async () => {
            setError("");
            setSuccess("");

            if (!values.password) {
                throw new Error("Not expected");
            }

            const request = await getStructuralUnitRequest(requestId);
            if (request) {
                await adminChangeRepresentationRequestStatus(requestId, true);
                const user = await createUser(request.username, request.phone, request.email, values.password);
                await createStructuralUnit(request.name, request.address, user.id);
                setSuccess("Пароль установлен успешно!");
                const signInResult = await signIn("credentials", {
                    email: user.email,
                    password: values.password,
                    redirect: false,
                });
                if (signInResult?.error) {
                    throw new Error(signInResult.error);
                }
                router.push("/");
                router.refresh();
            } else {
                setError("Что-то пошло не так!");
            }
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    void form.handleSubmit(onSubmit)(e);
                }}
                className="space-y-6"
            >
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Новый пароль</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} placeholder="******" type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="repeatPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Повторите пароль</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} placeholder="******" type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormFeedback errorMessage={error} successMessage={success} />
                <Button disabled={isPending} type="submit" className="w-full">
                    Установить пароль
                </Button>
            </form>
        </Form>
    );
};
