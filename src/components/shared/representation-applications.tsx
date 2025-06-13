import { useState } from "react";

import { UnitRequest } from "@/app/generated/prisma";
import { RequestDialog } from "@/components/dialogs/request-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function RepresentationApplications({
    applications,
    refreshApplications,
}: {
    applications: UnitRequest[];
    refreshApplications: () => Promise<void>;
}) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<"accept" | "decline">("accept");
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

    const handleAccept = (id: string) => {
        setDialogAction("accept");
        setDialogOpen(true);
        setSelectedRequestId(id);
    };

    const handleDecline = (id: string) => {
        setDialogAction("decline");
        setDialogOpen(true);
        setSelectedRequestId(id);
    };

    const renderStatusBadge = (status: string) => {
        const statusClasses = {
            PENDING: "bg-yellow-100 text-yellow-800",
            APPROVED: "bg-green-100 text-green-800",
            REFUSED: "bg-red-100 text-red-800",
            COMPLETED: "bg-blue-100 text-blue-800",
        };

        const statusLabels = {
            PENDING: "В ожидании",
            APPROVED: "Одобрено",
            REFUSED: "Отклонено",
            COMPLETED: "Завершено",
        };

        return (
            <span
                className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    statusClasses[status as keyof typeof statusClasses],
                )}
            >
                {statusLabels[status as keyof typeof statusLabels]}
            </span>
        );
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Заявки на структурные подразделения</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Имя</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications.map((application) => (
                        <TableRow key={application.id}>
                            <TableCell>{application.name}</TableCell>
                            <TableCell>{application.email}</TableCell>
                            <TableCell>{renderStatusBadge(application.status)}</TableCell>
                            <TableCell>
                                <div className="space-x-2">
                                    <Button
                                        onClick={() => {
                                            handleAccept(application.id);
                                        }}
                                        disabled={application.status !== "PENDING"}
                                        className="bg-green-600 text-white hover:bg-green-700"
                                        size="sm"
                                    >
                                        Принять
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            handleDecline(application.id);
                                        }}
                                        disabled={application.status !== "PENDING"}
                                        variant="destructive"
                                        size="sm"
                                    >
                                        Отклонить
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <RequestDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                action={dialogAction}
                selectedRequestId={selectedRequestId}
                refresh={refreshApplications}
            />
        </div>
    );
}
