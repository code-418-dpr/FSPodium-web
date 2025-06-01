import { UnitRequest } from "@/app/generated/prisma";
import { ExtendedEvent } from "@/prisma/types";

import { EventApplications } from "../shared/event-applications";
import { RepresentationApplications } from "../shared/representation-applications";

export function AdminApplications({ applications, events }: { applications: UnitRequest[]; events: ExtendedEvent[] }) {
    return (
        <div className="flex flex-col gap-8">
            <EventApplications events={events} isAdmin={true} />
            <RepresentationApplications applications={applications} />
        </div>
    );
}
