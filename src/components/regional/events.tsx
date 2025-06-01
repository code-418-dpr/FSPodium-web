"use client";

import { Discipline, Unit } from "@/app/generated/prisma";
import { ExtendedEvent } from "@/prisma/types";

import { NewEventDialog } from "../dialogs/new-event-dialog";
import { EventApplications } from "../shared/event-applications";

interface EventsProps {
    events: ExtendedEvent[];
    disciplines: Discipline[];
    unit: Unit;
}

export function Events({ events, disciplines, unit }: EventsProps) {
    return (
        <div className="space-y-4">
            <EventApplications events={events} isAdmin={false} />
            <NewEventDialog disciplines={disciplines} unit={unit} />
        </div>
    );
}
