"use client";

import { useEffect, useState } from "react";

import { redirect } from "next/navigation";

import { Notification, Status, UnitRequest, User, UserRole } from "@/app/generated/prisma";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getPendingEvents } from "@/data/event";
import { getUserNotifications } from "@/data/notifications";
import { getStructuralUnits } from "@/data/structural-unit";
import { getAllUnitRequests } from "@/data/unit-request";
import { getUserById } from "@/data/user";
import { useAuth } from "@/hooks/use-auth";
import { ExtendedEvent, UnitWithUser } from "@/prisma/types";

export default function AdminPage() {
    const [structuralUnits, setStructuralUnits] = useState<UnitWithUser[]>([]);
    const [events, setEvents] = useState<ExtendedEvent[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [, setUser_] = useState<User | null>();
    const [applications, setApplications] = useState<UnitRequest[]>([]);

    const { user } = useAuth();

    if (!user) {
        redirect("/login");
    }

    if (user.role !== UserRole.REGIONAL_REP) {
        redirect("/regional");
    }

    const refreshEvents = async () => {
        const eventsData = (await getPendingEvents()) as ExtendedEvent[];
        setEvents(eventsData);
    };
    const refreshUnits = async () => {
        const unitsData = (await getStructuralUnits()) as UnitWithUser[];
        setStructuralUnits(unitsData);
    };
    const refreshApplications = async () => {
        const applicationsData = await getAllUnitRequests();
        setApplications(applicationsData);
    };

    useEffect(() => {
        const fetchData = async () => {
            const unitsData = (await getStructuralUnits()) as UnitWithUser[];
            const eventsData = (await getPendingEvents()) as ExtendedEvent[];
            const userData = await getUserById(user.id);
            const notificationsData = await getUserNotifications(user.id);
            const applicationsData = await getAllUnitRequests();

            setStructuralUnits(unitsData);
            setEvents(eventsData);
            setNotifications(notificationsData);
            setUser_(userData);
            setApplications(applicationsData);
        };
        void fetchData();
    }, [user]);

    // Сортируем заявки так, чтобы заявки с статусом PENDING были в начале
    const sortedApplications = applications.sort((a, b) => {
        if (a.status === Status.PENDING && b.status !== Status.PENDING) {
            return -1;
        }
        if (a.status !== Status.PENDING && b.status === Status.PENDING) {
            return 1;
        }
        return 0;
    });

    return (
        <AdminDashboard
            applications={sortedApplications}
            representations={structuralUnits}
            events={events}
            notifications={notifications}
            user={user as User}
            refreshEvents={refreshEvents}
            refreshUnits={refreshUnits}
            refreshApplications={refreshApplications}
        />
    );
}
