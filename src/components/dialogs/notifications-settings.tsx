"use client";

import { Bell } from "lucide-react";
import { toast } from "sonner";

import { useState } from "react";

import { User } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { updateUserNotifications } from "@/data/user";

interface Props {
    user: User;
}

export default function NotificationsSettingsDialog({ user }: Props) {
    const [telegramEnabled, setTelegramEnabled] = useState(user.tgNotificationsEnabled);
    const [emailEnabled, setEmailEnabled] = useState(user.emailNotificationsEnabled);
    const [open, setOpen] = useState(false);

    const handleSaveSettings = async () => {
        await updateUserNotifications(user.id, telegramEnabled, emailEnabled);
        setOpen(false);
        toast.success("Настройки уведомлений сохранены");
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value: boolean) => {
                if (!value) {
                    setTelegramEnabled(user.tgNotificationsEnabled);
                    setEmailEnabled(user.emailNotificationsEnabled);
                }
                setOpen(value);
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 px-3 py-2">
                    <Bell className="h-5 w-5" />
                    Настройки уведомлений
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Настройки уведомлений
                    </DialogTitle>
                    <DialogDescription>Выберите, как вы хотите получать уведомления.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="telegram"
                            checked={telegramEnabled}
                            onCheckedChange={(checked) => {
                                setTelegramEnabled(checked as boolean);
                            }}
                        />
                        <Label htmlFor="telegram">Уведомления в Telegram</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="email"
                            checked={emailEnabled}
                            onCheckedChange={(checked) => {
                                setEmailEnabled(checked as boolean);
                            }}
                        />
                        <Label htmlFor="email">Email-уведомления</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={() => {
                            void handleSaveSettings();
                        }}
                    >
                        Сохранить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
