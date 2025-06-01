"use client";

import * as z from "zod";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { useSession } from "next-auth/react";

import { setPasswordSettings } from "@/actions/settings";
import { FormFeedback } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordSettingsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export function PasswordSettingsForm() {
    const { update } = useSession();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const form = useForm<z.infer<typeof PasswordSettingsSchema>>({
        resolver: zodResolver(PasswordSettingsSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
        },
    });

    const onSubmit = (values: z.infer<typeof PasswordSettingsSchema>) => {
        startTransition(() => {
            setPasswordSettings(values)
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    }

                    if (data.success) {
                        void update();
                        setSuccess(data.success);
                    }

                    form.reset();
                })
                .catch(() => {
                    setError("Something went wrong!");
                });
        });
    };

    return (
        <Form {...form}>
            <form
                className="space-y-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    void form.handleSubmit(onSubmit)(e);
                }}
            >
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Текущий пароль</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="******" type="password" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Новый пароль</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="******" type="password" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormFeedback errorMessage={error} successMessage={success} />
                <Button disabled={isPending} type="submit">
                    Сохранить
                </Button>
            </form>
        </Form>
    );
}
