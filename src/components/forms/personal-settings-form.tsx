"use client";

import * as z from "zod";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { useSession } from "next-auth/react";

import { setPersonalSettings } from "@/actions/settings";
import { UserRole } from "@/app/generated/prisma";
import { FormFeedback } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { PersonalSettingsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export function PersonalSettingsForm(): React.ReactNode {
    const user = useAuth().user;

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const { update } = useSession();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof PersonalSettingsSchema>>({
        resolver: zodResolver(PersonalSettingsSchema),
        defaultValues: {
            name: user?.name ?? "",
            email: user?.email ?? "",
            role: user?.role ?? UserRole.REGIONAL_REP,
        },
    });

    const onSubmit = (values: z.infer<typeof PersonalSettingsSchema>) => {
        startTransition(() => {
            setPersonalSettings(values)
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    }

                    if (data.success) {
                        void update();
                        setSuccess(data.success);
                    }
                })
                .catch(() => {
                    setError("Something went wrong!");
                });
        });
    };

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={() => void form.handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Имя</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="John Doe" disabled={isPending} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Роль</FormLabel>
                                <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите роль" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={UserRole.REGIONAL_REP}>
                                            Региональный представитель
                                        </SelectItem>
                                        <SelectItem value={UserRole.STRUCTURAL_UNIT}>
                                            Структурное подразделение
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="john.doe@example.com"
                                        type="email"
                                        disabled={isPending}
                                    />
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
