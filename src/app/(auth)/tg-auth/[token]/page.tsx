import { CheckIcon } from "lucide-react";

import { getServerSession } from "next-auth";

import { getUserByTgId, updateUserTgId } from "@/data/user";

export default async function TgAuthPage({ params }: { params: Promise<{ token: string }> }) {
    const token = decodeURIComponent((await params).token);

    const decodedToken = Buffer.from(token, "base64").toString("utf-8");
    const [tgUserIdStr, tgMsgIdStr] = decodedToken.split("|");
    const tgUserId = BigInt(tgUserIdStr);
    const tgMsgId = Number(tgMsgIdStr);

    const user = await getUserByTgId(tgUserId);
    const session = await getServerSession();
    if (!session?.user.id) {
        throw new Error("Not expected");
    }

    if (!user) {
        await updateUserTgId(session.user.id, tgUserId);
    }

    const role = user ? user.role : session.user.role;

    const response = await fetch(`${process.env.BOT_URL}/auth/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: tgUserId, msg_id: tgMsgId, role }),
    });
    if (!response.ok) {
        throw new Error("Authorization failed");
    }

    return (
        <div className="flex w-[400px] flex-col items-center justify-center space-y-4 gap-y-4">
            <h1 className="text-center text-3xl font-semibold">Подключение бота прошло успешно!</h1>
            <div className="flex w-full items-center justify-center">
                <CheckIcon className="h-32 w-32 text-green-500" />
            </div>
            <p>Вы можете закрыть эту страницу.</p>
        </div>
    );
}
