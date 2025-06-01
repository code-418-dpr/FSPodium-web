import db from "@/lib/db";

export async function createNotification(userId: string, title: string, message: string) {
    return db.notification.create({ data: { userId, title, message } });
}

export async function getUserNotifications(userId: string) {
    return db.notification.findMany({
        where: { userId },
        orderBy: {
            createdAt: "desc",
        },
    });
}
