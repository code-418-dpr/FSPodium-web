import React, { useEffect, useMemo, useState } from "react";

import { Status } from "@/app/generated/prisma";
import { Combobox } from "@/components/ui/combobox";
import { getStructuralUnits } from "@/data/structural-unit";
import { ExtendedEvent } from "@/prisma/types";
import { EventClickArg } from "@fullcalendar/core/index.js";
import ruLocale from "@fullcalendar/core/locales/ru";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

import { EventDialog } from "./EventDialog";

interface Item {
    id: string;
    name: string;
}
interface CalendarEvent {
    id: string;
    title: string;
    start: string | Date;
    end: string | Date;
    extendedProps: ExtendedEvent;
}
const Calendar: React.FC = () => {
    const [data, setData] = useState<ExtendedEvent[]>([]);
    const [formattedData, setFormattedData] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEventData, setSelectedEventData] = useState<ExtendedEvent | null>(null);
    const [representationItems, setRepresentation] = useState<Item[]>([]);
    const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

    // Фильтрация событий по выбранному подразделению
    const filteredEvents = useMemo(() => {
        if (!selectedUnitId) return data;

        return data.filter((event) => event.unitId === selectedUnitId && event.status === Status.APPROVED);
    }, [data, selectedUnitId]);

    const fetchRepresentations = async () => {
        try {
            const units = await getStructuralUnits();
            const items: Item[] = [
                { id: "all", name: "Все подразделения" },
                ...units.map((unit) => ({
                    id: unit.id,
                    name: unit.name,
                })),
            ];
            setRepresentation(items);
        } catch (error) {
            console.error("Error loading Units: ", error);
        }
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch("/api/calendar");
            if (!response.ok) {
                throw new Error("Ошибка подключения к API");
            }

            const result = (await response.json()) as ExtendedEvent[];
            if (!Array.isArray(result)) {
                throw new Error("Неверный формат данных от API");
            }
            setData(result);
            const approvedEvents = result.filter((event) => event.status === "APPROVED");
            const formatted = approvedEvents.map((event) => ({
                id: event.id,
                title: event.title || "Событие",
                start: event.start,
                end: event.end,
                extendedProps: event,
            }));
            setFormattedData(formatted);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Произошла неизвестная ошибка");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void fetchData();
        void fetchRepresentations();
    }, []);

    const handleEventClick = (info: EventClickArg): void => {
        // Находим событие по id в полных данных
        const selectedData = data.find((e) => e.id === info.event.id);
        setSelectedEventData(selectedData ?? null);
        setIsDialogOpen(true);
    };

    return (
        <div>
            <div className="flex flex-row space-x-6 py-4">
                <p className="px-2 py-1 text-lg">Структурное подразделение: </p>
                <Combobox
                    items={representationItems}
                    selectedId={selectedUnitId ?? "all"}
                    onIdChangeAction={(id) => {
                        setSelectedUnitId(id === "all" ? null : id);
                    }}
                    className="w-1/3"
                    disabled={isLoading}
                />
            </div>

            {isLoading && (
                <p className="flex items-center justify-center py-52 text-5xl font-black">
                    Календарь загружается, подождите...
                </p>
            )}

            {!isLoading && filteredEvents.length > 0 && (
                <div>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        initialDate={new Date()}
                        locale={ruLocale}
                        height={600}
                        editable={true}
                        selectable={true}
                        nextDayThreshold="00:00:00"
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,dayGridWeek",
                        }}
                        events={formattedData.filter(
                            (event) => !selectedUnitId || event.extendedProps.unitId === selectedUnitId,
                        )}
                        eventClick={handleEventClick}
                        eventContent={(eventInfo) => <div className="truncate px-1">{eventInfo.event.title}</div>}
                        eventStartEditable={false}
                        eventDurationEditable={false}
                    />

                    {selectedEventData && (
                        <EventDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} event={selectedEventData} />
                    )}
                </div>
            )}

            {!isLoading && filteredEvents.length <= 0 && (
                <p className="flex items-center justify-center py-52 text-center text-5xl font-black">
                    {selectedUnitId ? "В выбранном подразделении нет событий" : "Нет доступных событий"}
                </p>
            )}
        </div>
    );
};

export default Calendar;
