import { Info } from "lucide-react";

import { Notification, User } from "@/app/generated/prisma";
import NotificationsSettingsDialog from "@/components/dialogs/notifications-settings";

interface Props {
    notifications: Notification[];
    user: User;
}

export function Notifications({ notifications, user }: Props) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Уведомления</h2>
                <NotificationsSettingsDialog user={user} />
            </div>
            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <p className="text-gray-500">Нет уведомлений</p>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="flex items-start rounded-lg bg-gray-900 p-4 hover:bg-gray-800"
                        >
                            <Info className="mr-3 h-5 w-5 text-blue-400" />
                            <div className="flex flex-col gap-1">
                                <p className="font-medium">{notification.title}</p>
                                <p className="text-gray-400">{notification.message}</p>
                                <p className="text-sm text-gray-500">{notification.createdAt.toLocaleString()}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
