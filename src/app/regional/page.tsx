import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { UserRole } from "@/app/generated/prisma";
import { RegionalDashboard } from "@/components/regional/regional-dashboard";
import { getAllDisciplines } from "@/data/discipline";
import { getEventsFromUser } from "@/data/event";
import { getUserNotifications } from "@/data/notifications";
import { getStructuralUnitByUserId } from "@/data/structural-unit";
import { getUserByEmail } from "@/data/user";
import { authOptions } from "@/lib/auth-options";
import { ExtendedEvent } from "@/prisma/types";

export default async function RegionalPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role === UserRole.REGIONAL_REP) {
        console.log(session.user);
        redirect("/admin");
    }

    const user = await getUserByEmail(session.user.email);
    const events = (await getEventsFromUser(session.user.id)) as ExtendedEvent[];
    const representation = await getStructuralUnitByUserId(session.user.id);
    const notifications = await getUserNotifications(session.user.id);
    const disciplines = await getAllDisciplines();

    return (
        <RegionalDashboard
            user={user!}
            events={events}
            notifications={notifications}
            unit={representation!}
            disciplines={disciplines}
        />
    );
}
