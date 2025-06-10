import { UnitRequest } from "@/app/generated/prisma";
import { ExtendedEvent } from "@/prisma/types";

import { EventApplications } from "../shared/event-applications";
import { RepresentationApplications } from "../shared/representation-applications";

export function AdminApplications({
    applications,
    events,
    refreshEvents,
    refreshApplications,
}: {
    applications: UnitRequest[] | null;
    events: ExtendedEvent[] | null;
    refreshEvents: () => Promise<void>;
    refreshApplications: () => Promise<void>;
}) {
    return (
        <div className="flex flex-col gap-8">
            <EventApplications events={events!} isAdmin={true} refreshEvents={refreshEvents} />
            <RepresentationApplications applications={applications!} refreshApplications={refreshApplications} />
        </div>
    );
}
