"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UnitWithUser } from "@/prisma/types";

import { EditRepresentationDialog } from "../dialogs/edit-representation-dialog";

interface Props {
    units: UnitWithUser[];
    refreshUnits: () => Promise<void>;
}

export function StructuralUnits({ units, refreshUnits }: Props) {
    const [open, setOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<UnitWithUser | null>(null);

    const handleEdit = (representation: UnitWithUser) => {
        setEditingUnit(representation);
        setOpen(true);
    };

    return (
        <div className="text-white">
            <h2 className="mb-4 text-2xl font-bold">Представительства</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Представитель</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Дата создания</TableHead>
                        <TableHead>Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {units.map((unit) => (
                        <TableRow key={unit.id}>
                            <TableCell>{unit.user.name}</TableCell>
                            <TableCell>{unit.user.email}</TableCell>
                            <TableCell>{new Date(unit.createdAt).toLocaleDateString("ru-RU")}</TableCell>
                            <TableCell>
                                <Button
                                    className="bg-blue-500 hover:bg-blue-600"
                                    variant="outline"
                                    onClick={() => {
                                        handleEdit(unit);
                                    }}
                                >
                                    Редактировать
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <EditRepresentationDialog
                key={editingUnit?.id}
                open={open}
                onOpenChange={setOpen}
                representation={editingUnit}
                refresh={refreshUnits}
            />
        </div>
    );
}
