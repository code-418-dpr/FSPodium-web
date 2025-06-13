import { PrinterIcon } from "lucide-react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { useEffect, useState } from "react";

import { Event, EventLevel, Status } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAndFilterEventsForAll } from "@/data/event";
import { ExtendedEvent } from "@/prisma/types";

export function Analytics() {
    const [events, setEvents] = useState<ExtendedEvent[]>([]);
    const [participantData, setParticipantData] = useState<unknown[]>([]);
    const [levelData, setLevelData] = useState<unknown[]>([]);
    const groupParticipantsByMonth = (events: Event[]) => {
        const monthlyData: Record<string, number> = {};

        events.forEach((event) => {
            const startDate = new Date(event.start);
            const month = startDate.getMonth();
            const year = startDate.getFullYear();
            const key = `${year}-${month}`;

            monthlyData[key] = (monthlyData[key] || 0) + (event.participantsCount || 0);
        });

        return Object.entries(monthlyData)
            .sort(([keyA], [keyB]) => {
                const [yearA, monthA] = keyA.split("-").map(Number);
                const [yearB, monthB] = keyB.split("-").map(Number);

                return yearA === yearB ? monthA - monthB : yearA - yearB;
            })
            .map(([key, value]) => {
                const [year, month] = key.split("-").map(Number);
                const monthName = new Date(year, month).toLocaleString("default", {
                    month: "short",
                });
                return {
                    name: `${monthName} ${year}`,
                    value,
                };
            });
    };
    const groupParticipantsByLevel = (events: Event[]) => {
        const levelData: Record<string, number> = {};

        events.forEach((event) => {
            let level: string = event.level; // FEDERAL, ALL_RUSSIA, REGION
            if (level === "ALL_RUSSIA") {
                level = "ВСЕРОССИЙСКИЕ";
            } else if (level === "FEDERAL_DISTRICT") {
                level = "ФЕДЕРАЛЬНЫЕ";
            } else if (level === "REGION") {
                level = "РЕГИОНАЛЬНЫЕ";
            }
            levelData[level] = (levelData[level] || 0) + (event.participantsCount || 0);
        });

        return Object.entries(levelData).map(([name, value]) => ({ name, value }));
    };
    const getAllParticipantsCount = () => {
        return events.reduce(
            (total, event) => total + (event.status === Status.APPROVED ? event.participantsCount : 0),
            0,
        );
    };
    const getPopularRepresentation = () => {
        const representationCounts = events.reduce<Record<string, number>>((counts, event) => {
            if (event.unit) {
                const name = event.unit.name;
                counts[name] = (counts[name] ?? 0) + 1;
            } else {
                const name = "Центральное";
                counts[name] = (counts[name] ?? 0) + 1;
            }
            return counts;
        }, {});
        const maxCount = Math.max(...Object.values(representationCounts));
        return Object.entries(representationCounts)
            .filter(([, count]) => count === maxCount)
            .map(([name]) => {
                return name;
            })
            .join(", ");
    };
    const getMaxCountEvents = () => {
        const maxCountEvent = events.reduce<Record<string, number>>((counts, event) => {
            const name = event.title;
            counts[name] = event.participantsCount;
            return counts;
        }, {});
        const maxCount = Math.max(...Object.values(maxCountEvent));
        const result = Object.entries(maxCountEvent).find(([, count]) => count === maxCount);
        return result ?? [];
    };
    const getPopularLevel = () => {
        const levelCounts = events.reduce<Record<string, number>>((counts, event) => {
            if (event.status === Status.APPROVED) {
                const level = event.level;
                counts[level] = (counts[level] ?? 0) + 1;
            }
            return counts;
        }, {});
        const maxCount = Math.max(...Object.values(levelCounts));

        return Object.entries(levelCounts)
            .filter(([, count]) => count === maxCount)
            .map(([level]) => {
                switch (level) {
                    case EventLevel.REGION:
                        return "Региональные";
                    case EventLevel.FEDERAL_DISTRICT:
                        return "Федеральные";
                    case EventLevel.ALL_RUSSIA:
                        return "Всероссийские";
                    default:
                        return level;
                }
            })
            .join(", ");
    };
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const previousMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const previousMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const getAllParticipantCountLastMonth = events.reduce((total, event) => {
        const eventStartDate = new Date(event.start);
        const eventEndDate = new Date(event.end);
        const isLastMonthEvent =
            (eventStartDate >= previousMonthStart && eventStartDate <= previousMonthEnd) ||
            (eventEndDate >= previousMonthStart && eventEndDate <= previousMonthEnd) ||
            (eventStartDate <= previousMonthStart && eventEndDate >= previousMonthEnd);
        return total + (isLastMonthEvent && event.status === Status.APPROVED ? event.participantsCount : 0);
    }, 0);
    const popularRepresentation = getPopularRepresentation();
    const maxEventsCount = getMaxCountEvents();
    const popularDiscipline = getPopularLevel();
    const pendingEventsCount = events.filter((event) => event.status === Status.PENDING).length;
    const onlineEvents = events.filter((event) => {
        const eventStartDate = new Date(event.start);
        return (
            event.isOnline &&
            event.status === Status.APPROVED &&
            eventStartDate >= firstDayOfMonth &&
            eventStartDate <= lastDayOfMonth
        );
    }).length;
    const offlineEvents = events.filter((event) => {
        const eventStartDate = new Date(event.start);
        console.log(events);
        return (
            !event.isOnline &&
            event.status === Status.APPROVED &&
            eventStartDate >= firstDayOfMonth &&
            eventStartDate <= lastDayOfMonth
        );
    }).length;
    const allParticipantsCount = getAllParticipantsCount();
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const fetchedEvents = await getAndFilterEventsForAll();
                setEvents(fetchedEvents);
                const groupedByMonth = groupParticipantsByMonth(fetchedEvents);
                setParticipantData(groupedByMonth);
                const groupedByLevel = groupParticipantsByLevel(fetchedEvents);
                setLevelData(groupedByLevel);
            } catch (error) {
                console.error("Ошибка при загрузке событий: ", error);
            }
        };

        void fetchEvents();
    }, []);
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Аналитика</h2>
                <Button
                    className="print:hidden"
                    variant="outline"
                    onClick={() => {
                        window.print();
                    }}
                >
                    <PrinterIcon className="mr-2 h-4 w-4" />
                    Распечатать
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Количество участников по месяцам</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={participantData}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Line type="monotone" dataKey="value" stroke="#3B83F6" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Активность по соревнованиям</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={levelData}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Bar dataKey="value" fill="#3B83F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Всего заявок</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{events.length}</div>
                        <p className="text-muted-foreground text-xs">{pendingEventsCount} на рассмотрении</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Количество спортсменов</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{allParticipantsCount}</div>
                        <p className="text-muted-foreground text-xs">
                            +{getAllParticipantCountLastMonth} за прошлый месяц
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Наиболее активное структурное подразделение
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{popularRepresentation}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Самое масштабное событие</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {maxEventsCount.length > 0 ? (
                            <>
                                <div className="text-xl font-bold">{maxEventsCount[0]}</div>
                                <p className="text-muted-foreground text-xs">Участников: {maxEventsCount[1]}</p>
                            </>
                        ) : (
                            <p className="text-muted-foreground text-xs">Нет данных</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Популярные виды соревнований</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{popularDiscipline}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Виды событий в этом месяце</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold">
                            {onlineEvents > offlineEvents ? `Онлайн: ${onlineEvents}` : `Офлайн: ${offlineEvents}`}
                        </div>
                        <div className="text-xl font-bold">
                            {onlineEvents < offlineEvents ? `Онлайн: ${onlineEvents}` : `Офлайн: ${offlineEvents}`}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
