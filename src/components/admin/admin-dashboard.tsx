"use client";

import { BarChart2, Bell, FileText, Users } from "lucide-react";

import { useEffect, useState } from "react";

import { Notification, UnitRequest, User } from "@/app/generated/prisma";
import { Analytics } from "@/components/admin/analytics";
import { StructuralUnits } from "@/components/admin/structural-units";
import { Notifications } from "@/components/shared/notifications";
import { Sidebar } from "@/components/shared/sidebar";
import { ExtendedEvent, UnitWithUser } from "@/prisma/types";

import { AdminApplications } from "./admin-applications";

export function AdminDashboard({
    applications,
    representations,
    events,
    notifications,
    user,
    refreshEvents,
    refreshUnits,
    refreshApplications,
}: {
    applications: UnitRequest[] | null;
    representations: UnitWithUser[] | null;
    events: ExtendedEvent[] | null;
    notifications: Notification[] | null;
    user: User;
    refreshEvents: () => Promise<void>;
    refreshUnits: () => Promise<void>;
    refreshApplications: () => Promise<void>;
}) {
    const [activeSection, setActiveSection] = useState("analytics");

    useEffect(() => {
        const storedSection = localStorage.getItem("adminActiveSection");
        if (storedSection) {
            setActiveSection(storedSection);
        }
    }, []);

    const handleSetActiveSection = (sectionId: string) => {
        setActiveSection(sectionId);
        localStorage.setItem("adminActiveSection", sectionId);
    };

    const menuItems = [
        { name: "Аналитика", icon: BarChart2, id: "analytics" },
        { name: "Заявки", icon: FileText, id: "applications" },
        { name: "Представительства", icon: Users, id: "representations" },
        { name: "Уведомления", icon: Bell, id: "notifications" },
    ];

    const renderSection = () => {
        switch (activeSection) {
            case "applications":
                return (
                    <AdminApplications
                        applications={applications}
                        events={events}
                        refreshEvents={refreshEvents}
                        refreshApplications={refreshApplications}
                    />
                );
            case "representations":
                return <StructuralUnits units={representations!} refreshUnits={refreshUnits} />;
            case "notifications":
                return <Notifications notifications={notifications!} user={user} />;
            default:
                return <Analytics />;
        }
    };

    return (
        <div className="flex flex-1">
            <Sidebar activeSection={activeSection} setActiveSection={handleSetActiveSection} menuItems={menuItems} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">{renderSection()}</main>
            </div>
        </div>
    );
}
