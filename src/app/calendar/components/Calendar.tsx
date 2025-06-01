import React, { useEffect, useState } from "react";

import { Event, Unit } from "@/app/generated/prisma";
import { Combobox } from "@/components/ui/combobox";
import { ExtendedEvent } from "@/prisma/types";
import { EventClickArg } from "@fullcalendar/core/index.js";
import ruLocale from "@fullcalendar/core/locales/ru";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

import { EventDialog } from "./EventDialog";

interface Item {
    id: string; // Уникальный идентификатор округа
    name: string; // Название округа
}
const Calendar: React.FC = () => {
    const [data, setData] = useState<ExtendedEvent[]>([]); // Вся информация о событии
    const [, setFormattedData] = useState<unknown>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [, setError] = useState<string | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false); // Управление открытием диалога
    const [selectedEventData, setSelectedEventData] = useState<ExtendedEvent | null>(null); // Полная информация о выбранном событии
    const [, setRepresentation] = useState<Item[]>([]);

    // const filterEvents = () => {
    //     return data.filter((event) => {
    //         const isApproved = event.status === Status.APPROVED;
    //
    //         const isSupremeRepresentationSelected = event.unit === null;
    //
    //         if (selectedFederalDistrict && selectedDistrict) {
    //             // Если выбраны и федеральный округ, и представительство
    //             return isApproved && hasMatchingFederalDistrict && hasMatchingRepresentation;
    //         } else if (selectedDistrict === "null") {
    //             // Если выбрано "Верховное представительство ФСП"
    //             return isApproved && isSupremeRepresentationSelected;
    //         } else if (selectedFederalDistrict) {
    //             // Если выбран только федеральный округ
    //             return isApproved && hasMatchingFederalDistrict;
    //         } else if (selectedDistrict) {
    //             // Если выбрано только представительство
    //             return isApproved && hasMatchingRepresentation;
    //         }
    //
    //         return isApproved; // Если ничего не выбрано, возвращаем только APPROVED
    //     });
    // };
    //
    // const filteredEvents = useMemo(() => filterEvents(), [filterEvents]);
    const fetchRepresentations = async () => {
        try {
            const representationResponse = await fetch("/api/calendar/representation");
            if (!representationResponse.ok) {
                throw new Error("Error connection API Representation");
            }
            const representationResult = (await representationResponse.json()) as unknown as Unit[];
            const representations = [
                { id: "null", name: "Центральное" }, // Добавляем элемент вручную
                ...representationResult.map((representation: Unit) => ({
                    id: representation.id,
                    name: representation.name,
                })),
            ];
            setRepresentation(representations);
        } catch (error) {
            console.error("Error loading Representations: ", error);
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

            const result = (await response.json()) as unknown as ExtendedEvent[];
            setData(result);

            const formattedResult: unknown = result.map((event: Event) => ({
                id: event.id,
                title: event.title || "Событие ",
                start: event.start,
                end: event.end,
            }));
            setFormattedData(formattedResult);
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
        const selectedData = data.find((e: Event) => e.id === String(info.event.id));
        setSelectedEventData(selectedData ?? null); // Устанавливаем всю информацию о событии для диалогового окна
        setIsDialogOpen(true);
    };

    return (
        <div>
            <div className="flex flex-row space-x-6 py-4">
                <p className="px-2 py-1 text-lg">Представительство: </p>
                <Combobox
                    // items={representationItems} // Передаем список представительств
                    // selectedId={selectedDistrict || ""} // Текущее выбранное значение
                    // onIdChangeAction={(value) => {
                    //     if (value === "null") {
                    //         setSelectedFederalDistrict("");
                    //         setSelectedDistrict(value); // Сбрасываем поле, если выбрано "Центральное"
                    //     } else {
                    //         setSelectedDistrict(value);
                    //     }
                    // }} // Обработчик изменения
                    // className="w-1/3" // Класс для определения ширины объекта
                    // disabled={isLoading} // Элемент всегда включён
                    items={[]}
                    onIdChangeAction={() => {
                        return;
                    }}
                    selectedId="1"
                    disabled={true}
                />
            </div>
            {isLoading && (
                <p className="flex items-center justify-center py-52 text-5xl font-black">
                    Календарь загружается, подождите...
                </p>
            )}
            {!isLoading && data.length > 0 && (
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
                        events={data}
                        eventClick={handleEventClick}
                        eventContent={(eventInfo) => <div>{eventInfo.event.title}</div>}
                        eventStartEditable={false}
                        eventDurationEditable={false}
                    />
                    {selectedEventData && (
                        <EventDialog
                            isOpen={isDialogOpen}
                            setIsOpen={setIsDialogOpen}
                            event={selectedEventData} // Передача полной информации о событии
                        />
                    )}
                </div>
            )}
            {!isLoading && data.length <= 0 && (
                <p className="flex items-center justify-center py-52 text-center text-5xl font-black">
                    По вашим параметрам не нашлось ни одного события
                </p>
            )}
        </div>
    );
};

export default Calendar;
