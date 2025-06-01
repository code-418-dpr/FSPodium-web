import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from "@/data/user";
import { UnitWithUser } from "@/prisma/types";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    representation: UnitWithUser | null;
}

export function EditRepresentationDialog({ open, onOpenChange, representation }: Props) {
    const [editingRepresentation, setEditingRepresentation] = useState(representation);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await updateUser(
            editingRepresentation!.user.id,
            editingRepresentation!.user.name,
            editingRepresentation!.user.email,
        );

        onOpenChange(false);
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="text-white" aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Редактировать представительство</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        void handleSubmit(e);
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-1">
                        <Label htmlFor="name">Имя представителя</Label>
                        <Input
                            id="name"
                            name="User.name"
                            value={editingRepresentation?.user.name ?? ""}
                            onChange={(event) => {
                                setEditingRepresentation({
                                    ...editingRepresentation!,
                                    user: {
                                        ...editingRepresentation!.user,
                                        name: event.target.value,
                                    },
                                });
                            }}
                            className="bg-gray-900"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="User.email"
                            value={editingRepresentation?.user.email}
                            onChange={(event) => {
                                setEditingRepresentation({
                                    ...editingRepresentation!,
                                    user: {
                                        ...editingRepresentation!.user,
                                        email: event.target.value,
                                    },
                                });
                            }}
                            className="bg-gray-900"
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                            }}
                        >
                            Отменить
                        </Button>
                        <Button type="submit">Сохранить</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
