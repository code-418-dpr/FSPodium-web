"use server";

import { User } from "@/app/generated/prisma";
import { createNotification } from "@/data/notifications";
import { getAdmins } from "@/data/user";
import { sendEmail } from "@/lib/mail";

export async function sendEventAcceptedNotification(user: User, eventTitle: string) {
    const title = "Ваша заявка на проведение события принята!";
    const message = `Ваша заявка на проведение события "${eventTitle}" принята!`;

    await sendNotification(user, title, message);
}

export async function sendEventDeclinedNotification(user: User, eventTitle: string, refusalReason: string) {
    const title = "Ваша заявка на проведение события отклонена";
    const message = `Ваша заявка на проведение события «${eventTitle}» отклонена по причине: ${refusalReason}`;

    await sendNotification(user, title, message);
}

export async function sendNewEventRequestNotification(eventTitle: string, unitName: string) {
    const admins = await getAdmins();
    if (admins.length > 0) {
        const title = "Заявка на организацию события";
        const message = `Поступила новая заявка на проведение события «${eventTitle}» подразделением ${unitName}.\nПодтвердите или отклоните заявку в FSPodium.`;
        await Promise.all(admins.map((admin) => sendNotification(admin, title, message)));
    }
}

export async function sendUnitRequestNotification(name: string, address: string) {
    const admins = await getAdmins();
    if (admins.length > 0) {
        const title = "Заявка на регистрацию структурного подразделения";
        const message = `Поступила новая заявка на регистрацию структурного подразделения ФСП.\nНаименование: ${name}\nАдрес: ${address}\nПодтвердите или отклоните заявку в FSPodium.`;
        await Promise.all(admins.map((admin) => sendNotification(admin, title, message)));
    }
}

async function sendNotification(user: User, title: string, message: string) {
    await createNotification(user.id, title, message);

    if (user.emailNotificationsEnabled) {
        await sendEmail(user.email, title, message);
    }

    try {
        if (user.tgId && user.tgNotificationsEnabled) {
            await fetch(`${process.env.BOT_URL}/notifications/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user.tgId, message }),
            });
        }
    } catch (error) {
        console.error(error);
    }
}

export async function sendUnitAcceptedEmail(email: string, url: string) {
    const title = "Заявка на регистрацию подразделения ФСП принята!";
    const message =
        "С радостью сообщаем, что ваша заявка на регистрацию структурного подразделения ФСП принята!" +
        ` Перейдите по ссылке и установите пароль для завершения регистрации: ${url}`;

    await sendEmail(email, title, message);
}

export async function sendUnitDeclinedEmail(email: string, refusalReason: string) {
    const title = "Заявка на регистрацию подразделения ФСП отклонена";
    const message = `К сожалению, ваша заявка на регистрацию структурного подразделения ФСП отклонена.\n${refusalReason}`;

    await sendEmail(email, title, message);
}
