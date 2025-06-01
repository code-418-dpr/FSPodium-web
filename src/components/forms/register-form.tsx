"use client";

import * as z from "zod";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { FormFeedback } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { applyStructuralUnitRequest } from "@/data/unit-request";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            username: "",
            address: "",
            phone: "",
        },
    });

    const onSubmit: SubmitHandler<z.infer<typeof RegisterSchema>> = async ({
        name,
        address,
        username,
        email,
        phone,
    }) => {
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            await applyStructuralUnitRequest(name, address, username, email, +phone);
            setSuccess("Заявка отправлена! После одобрения вам придёт письмо на указанный email.");
            form.reset();
            setIsLoading(false);
        } catch (error) {
            setError(String(error));
            form.reset();
            setIsLoading(false);
        }
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Наименование структурного подразделения</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isLoading} placeholder="ФГБОУ ВО «ДонНТУ»" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Адрес подразделения</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isLoading} placeholder="г. Донецк, ул. Артёма, 58" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ФИО руководителя подразделения</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isLoading} placeholder="Иванов Иван Иванович" />
                                </FormControl>
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
                                    <Input {...field} disabled={isLoading} placeholder="ivanov@mail.ru" type="email" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Номер телефона (без +7)</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isLoading} placeholder="9491234567" type="number" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormFeedback errorMessage={error} successMessage={success} />
                <Button disabled={isLoading} type="submit" className="w-full">
                    Подать заявку
                </Button>
            </form>
        </Form>
    );
};
