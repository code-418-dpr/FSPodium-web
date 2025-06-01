"use client";

import { useRouter } from "next/navigation";

import { PasswordSettingsForm } from "@/components/forms/password-settings-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function SettingsPage() {
    const { user } = useAuth();
    const router = useRouter();

    if (!user) {
        router.refresh();
    }

    return (
        <div className="flex w-full flex-col items-center gap-8 p-4">
            <h1 className="text-center text-3xl font-bold">Настройки</h1>
            <Card className="w-3/4 max-w-[600px]">
                <CardHeader>
                    <p className="text-xl font-semibold">Пароль</p>
                </CardHeader>
                <CardContent>
                    <PasswordSettingsForm />
                </CardContent>
            </Card>
        </div>
    );
}
