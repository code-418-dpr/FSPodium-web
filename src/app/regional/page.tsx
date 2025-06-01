import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { UserRole } from "@/app/generated/prisma";
import { RegionalDashboard } from "@/components/regional/regional-dashboard";
import { getAllDisciplines } from "@/data/discipline";
import { getEventsFromUser } from "@/data/event";
import { getUserNotifications } from "@/data/notifications";
import { getStructuralUnitByUserId } from "@/data/structural-unit";
import { getUserById } from "@/data/user";

export default async function RegionalPage() {
    const session = await getServerSession();

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== UserRole.REGIONAL_REP) {
        redirect("/admin");
    }

    const user = await getUserById(session.user.id);
    const events = await getEventsFromUser(session.user.id);
    const representation = await getStructuralUnitByUserId(session.user.id);
    const notifications = await getUserNotifications(session.user.id);
    const disciplines = await getAllDisciplines();

    if (!user || !representation) {
        redirect("/regional");
    }

    return (
        <RegionalDashboard
            user={user}
            events={events}
            notifications={notifications}
            unit={representation}
            disciplines={disciplines}
        />
    );
}
