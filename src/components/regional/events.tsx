"use client";

import { useState } from "react";

import { Discipline, Unit } from "@/app/generated/prisma";
import { ExtendedEvent } from "@/prisma/types";

import { StatusBadge } from "../badges/status-badge";
import { NewEventDialog } from "../dialogs/new-event-dialog";
import { EventApplications } from "../shared/event-applications";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface EventsProps {
    events: ExtendedEvent[];
    disciplines: Discipline[];
    unit: Unit;
    userRole: string;
}

export function Events({ events, disciplines, unit, userRole }: EventsProps) {
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    const filteredEvents = selectedStatus ? events.filter((event) => event.status === selectedStatus) : events;

    const eventStatuses = ["PENDING", "APPROVED", "REFUSED", "COMPLETED"];

    return (
        <div className="space-y-4">
            {userRole === "STRUCTURAL_UNIT" && (
                <div className="flex items-center gap-4">
                    <div className="text-sm font-medium">Фильтр по статусу:</div>
                    <Select
                        value={selectedStatus ?? ""}
                        onValueChange={(value) => {
                            setSelectedStatus(value === "all" ? null : value);
                        }}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Все заявки" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Все заявки</SelectItem>
                            {eventStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={status} />
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <EventApplications
                events={filteredEvents}
                isAdmin={false}
                refreshEvents={function (): Promise<void> {
                    throw new Error("Function not implemented.");
                }}
            />
            <NewEventDialog disciplines={disciplines} unit={unit} />
        </div>
    );
}
