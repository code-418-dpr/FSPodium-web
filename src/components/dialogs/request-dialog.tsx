import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { declineEventRequest } from "@/data/event";
import { adminChangeRepresentationRequestStatus } from "@/data/unit-request";
import { cn } from "@/lib/utils";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    action: "accept" | "decline";
    selectedRequestId: string | null;
    forEvents?: boolean;
}

export function RequestDialog({ open, onOpenChange, action, selectedRequestId, forEvents }: Props) {
    const [refusalReason, setRefusalReason] = useState("");
    const router = useRouter();

    async function handleConfirm() {
        if (!selectedRequestId) {
            throw new Error("Не выбрана заявка");
        }

        if (forEvents && action === "decline") {
            await declineEventRequest(selectedRequestId, refusalReason);
        } else if (action === "accept") {
            await adminChangeRepresentationRequestStatus(selectedRequestId, true);
        } else {
            await adminChangeRepresentationRequestStatus(selectedRequestId, false, refusalReason);
        }

        onOpenChange(false);
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{action === "accept" ? "Принять заявку" : "Отклонить заявку"}</DialogTitle>
                    <DialogDescription>
                        {action === "accept"
                            ? "При принятии этой заявки, все остальные заявки с этого региона будут автоматически отклонены"
                            : "Для отклонения заявки, введите причину отклонения"}
                    </DialogDescription>
                </DialogHeader>
                {action === "decline" && (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="refusalReason" className="text-right">
                                Причина отклонения
                            </Label>
                            <Input
                                id="refusalReason"
                                className="col-span-3"
                                value={refusalReason}
                                onChange={(e) => {
                                    setRefusalReason(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            onOpenChange(false);
                        }}
                    >
                        Отмена
                    </Button>
                    <Button
                        className={cn(
                            "text-white",
                            action === "accept" ? "bg-green-700 hover:bg-green-800" : "bg-red-700 hover:bg-red-800",
                        )}
                        onClick={() => {
                            void handleConfirm();
                        }}
                        disabled={action === "decline" && refusalReason.length === 0}
                    >
                        Подтвердить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
