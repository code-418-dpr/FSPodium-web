import { useState } from "react";

import { LevelBadge } from "@/components/badges/level-badge";
import { StatusBadge } from "@/components/badges/status-badge";
import { EventViewer } from "@/components/dialogs/event-viewer";
import { RequestDialog } from "@/components/dialogs/request-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { acceptEventRequest } from "@/data/event";
import { ExtendedEvent } from "@/prisma/types";

export function EventApplications({
    events,
    isAdmin,
    refreshEvents,
}: {
    events: ExtendedEvent[];
    isAdmin: boolean;
    refreshEvents: () => Promise<void>;
}) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<ExtendedEvent | null>(null);

    const handleAccept = async (id: string) => {
        await acceptEventRequest(id);
        await refreshEvents();
    };

    const handleDecline = (id: string) => {
        setDialogOpen(true);
        setSelectedRequestId(id);
    };

    const handleViewEvent = (event: ExtendedEvent) => {
        setSelectedEvent(event);
        setViewerOpen(true);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">События</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Название</TableHead>
                        <TableHead>Уровень</TableHead>
                        <TableHead>Начало</TableHead>
                        <TableHead>Конец</TableHead>
                        <TableHead>Онлайн</TableHead>
                        <TableHead>Статус</TableHead>
                        {isAdmin && <TableHead>Действия</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {events.map((event) => (
                        <TableRow
                            key={event.id}
                            className="cursor-pointer"
                            onClick={() => {
                                handleViewEvent(event);
                            }}
                        >
                            <TableCell>{event.title}</TableCell>
                            <TableCell>
                                <LevelBadge level={event.level} />
                            </TableCell>
                            <TableCell>{new Date(event.start).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(event.end).toLocaleDateString()}</TableCell>
                            <TableCell>{event.isOnline ? "Да" : "Нет"}</TableCell>
                            <TableCell>
                                <StatusBadge status={event.status} />
                            </TableCell>
                            {isAdmin && (
                                <TableCell>
                                    <div className="space-x-2">
                                        <Button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                void handleAccept(event.id);
                                            }}
                                            disabled={event.status !== "PENDING"}
                                            className="bg-green-600 text-white hover:bg-green-700"
                                            size="sm"
                                        >
                                            Принять
                                        </Button>
                                        <Button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                void handleDecline(event.id);
                                            }}
                                            disabled={event.status !== "PENDING"}
                                            variant="destructive"
                                            size="sm"
                                        >
                                            Отклонить
                                        </Button>
                                    </div>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <RequestDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                action={"decline"}
                selectedRequestId={selectedRequestId}
                forEvents={true}
                refresh={refreshEvents}
            />
            <EventViewer open={viewerOpen} setOpen={setViewerOpen} event={selectedEvent} isAdmin={isAdmin} />
        </div>
    );
}
