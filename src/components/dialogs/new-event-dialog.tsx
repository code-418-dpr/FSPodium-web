"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Discipline, EventLevel, Unit } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createEventRequest } from "@/data/event";
import { CheckedState } from "@radix-ui/react-checkbox";

import { Separator } from "../ui/separator";

interface Props {
    disciplines: Discipline[];
    unit: Unit;
}

export function NewEventDialog({ disciplines, unit }: Props) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<{
        title: string;
        ageRange: string;
        start: Date;
        end: Date;
        isOnline: boolean;
        participantsCount: number;
        level: EventLevel;
        status: string;
        sportObject: string;
        addressObject: string;
        disciplinesIds: string[];
    }>({
        title: "",
        ageRange: "",
        start: new Date(),
        end: new Date(),
        isOnline: true,
        participantsCount: 0,
        level: EventLevel.REGION,
        status: "DRAFT",
        sportObject: "",
        addressObject: "",
        disciplinesIds: [],
    });

    const handleChange = (name: string, value: string | number | boolean | Date) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const sportObjectData = formData.isOnline
            ? null
            : {
                  name: formData.sportObject,
                  address: formData.addressObject,
              };

        try {
            await createEventRequest(
                formData.title,
                formData.ageRange,
                formData.start,
                formData.end,
                formData.isOnline,
                formData.level,
                formData.participantsCount,
                unit.id,
                sportObjectData,
                formData.disciplinesIds,
            );

            setFormData({
                title: "",
                ageRange: "",
                start: new Date(),
                end: new Date(),
                isOnline: true,
                participantsCount: 0,
                level: EventLevel.REGION,
                status: "DRAFT",
                sportObject: "",
                addressObject: "",
                disciplinesIds: [],
            });

            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDisciplineSelection = (disciplineId: string, checked: CheckedState) => {
        setFormData((prevFormData) => {
            const updatedDisciplines = checked
                ? [...prevFormData.disciplinesIds, disciplineId]
                : prevFormData.disciplinesIds.filter((id) => id !== disciplineId);

            return {
                ...prevFormData,
                disciplinesIds: updatedDisciplines,
            };
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Создать новое событие</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[800px]">
                <DialogTitle>Создать новое событие</DialogTitle>
                <form
                    onSubmit={(e) => {
                        void handleSubmit(e);
                    }}
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Название</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={(e) => {
                                    handleChange("title", e.target.value);
                                }}
                                required
                                className="bg-gray-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ageRange">Возрастной диапазон</Label>
                            <Input
                                id="ageRange"
                                name="ageRange"
                                value={formData.ageRange}
                                onChange={(e) => {
                                    handleChange("ageRange", e.target.value);
                                }}
                                required
                                className="bg-gray-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="start">Дата начала</Label>
                            <Input
                                id="start"
                                name="start"
                                type="date"
                                value={formData.start.toISOString().split("T")[0]}
                                onChange={(e) => {
                                    handleChange("start", new Date(e.target.value));
                                }}
                                required
                                className="bg-gray-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end">Дата окончания</Label>
                            <Input
                                id="end"
                                name="end"
                                type="date"
                                value={formData.end.toISOString().split("T")[0]}
                                onChange={(e) => {
                                    handleChange("end", new Date(e.target.value));
                                }}
                                required
                                className="bg-gray-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="participantsCount">Количество участников</Label>
                            <Input
                                id="participantsCount"
                                name="participantsCount"
                                type="number"
                                value={formData.participantsCount}
                                onChange={(e) => {
                                    handleChange("participantsCount", parseInt(e.target.value));
                                }}
                                required
                                className="bg-gray-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="level">Уровень события</Label>
                            <Select
                                name="level"
                                value={formData.level}
                                onValueChange={(value) => {
                                    handleChange("level", value);
                                }}
                            >
                                <SelectTrigger className="bg-gray-900">
                                    <SelectValue placeholder="Выберите уровень" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="REGION">Региональный</SelectItem>
                                    <SelectItem value="FEDERAL_DISTRICT">Федеральный округ</SelectItem>
                                    <SelectItem value="ALL_RUSSIA">Всероссийский</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-4 py-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isOnline"
                                checked={formData.isOnline}
                                onCheckedChange={(checked) => {
                                    handleChange("isOnline", checked);
                                }}
                            />
                            <Label htmlFor="isOnline">Онлайн событие</Label>
                        </div>
                        {!formData.isOnline && (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="start">Место проведения:</Label>
                                    <Input
                                        id="sportObject"
                                        name="sportObject"
                                        value={formData.sportObject}
                                        onChange={(e) => {
                                            handleChange("sportObject", e.target.value);
                                        }}
                                        required
                                        className="bg-gray-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="start">Адрес:</Label>
                                    <Input
                                        id="adressObject"
                                        name="adressObject"
                                        value={formData.addressObject}
                                        onChange={(e) => {
                                            handleChange("addressObject", e.target.value);
                                        }}
                                        required
                                        className="bg-gray-900"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <Separator />
                    <div className="space-y-3 pt-3 pb-6">
                        <p className="text-sm text-gray-300">Дисциплины:</p>
                        {disciplines.length > 0 &&
                            disciplines.map((discipline) => (
                                <div key={discipline.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`discipline-${discipline.id}`}
                                        checked={formData.disciplinesIds.includes(discipline.id)}
                                        onCheckedChange={(checked) => {
                                            handleDisciplineSelection(discipline.id, checked);
                                        }}
                                    />
                                    <Label htmlFor={`discipline-${discipline.id}`}>{discipline.name}</Label>
                                </div>
                            ))}
                    </div>
                    <Button type="submit" className="w-full">
                        Создать событие
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
