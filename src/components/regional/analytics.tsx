import { PrinterIcon } from "lucide-react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { useEffect, useState } from "react";

import { Event, EventLevel, Status, User } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllEventsFromUser } from "@/data/event";

interface Props {
    user: User;
}

export function Analytics({ user }: Props) {
    const [events, setEvents] = useState<Event[]>([]);
    const [levelData, setLevelData] = useState<unknown[]>([]);
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                if (user.id) {
                    const fetchedEvents = await getAllEventsFromUser(user.id);
                    setEvents(fetchedEvents);
                    const groupedByLevel = groupParticipantsByLevel(fetchedEvents);
                    setLevelData(groupedByLevel);
                } else {
                    console.error("User is not defined or does not have an ID.");
                }
            } catch {
                console.error("Nope");
            }
        };
        void fetchEvents();
    }, [user.id]);
    const countApplicationsForPieChart = (events: Event[]) => {
        const summary = { approved: 0, refused: 0, pending: 0 };
        console.log("Все заявки: ", events);
        events.forEach((event) => {
            if (event.status === Status.APPROVED) {
                summary.approved += 1;
            } else if (event.status === Status.REFUSED) {
                summary.refused += 1;
            } else if (event.status === Status.PENDING) {
                summary.pending += 1;
            }
        });

        return [
            ...(summary.approved > 0 ? [{ name: "Принято", value: summary.approved }] : []),
            ...(summary.refused > 0 ? [{ name: "Отклонено", value: summary.refused }] : []),
            ...(summary.pending > 0 ? [{ name: "Ожидание", value: summary.pending }] : []),
        ];
    };
    const groupParticipantsByLevel = (events: Event[]) => {
        const levelData: Record<string, number> = {};

        events.forEach((event) => {
            let level: string = event.level; // FEDERAL_DISTRICT, ALL_RUSSIA, REGION
            if (level === EventLevel.ALL_RUSSIA) {
                level = "ВСЕРОССИЙСКИЕ";
            } else if (level === EventLevel.FEDERAL_DISTRICT) {
                level = "ФЕДЕРАЛЬНЫЕ";
            } else if (level === EventLevel.REGION) {
                level = "РЕГИОНАЛЬНЫЕ";
            }
            levelData[level] = (levelData[level] || 0) + (event.participantsCount || 0);
        });

        return Object.entries(levelData).map(([name, value]) => ({ name, value }));
    };
    const pendingEventsCount = events.filter((event) => event.status === Status.PENDING).length;
    const approvedEventsCount = events.filter((event) => event.status === Status.APPROVED).length;
    const onlineEvents = events.filter((event) => event.isOnline && event.status === Status.APPROVED).length;
    const offlineEvents = events.filter((event) => !event.isOnline && event.status === Status.APPROVED).length;
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const previousMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const previousMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const approvedEventsCountMonth = events.filter((event) => {
        const eventStartDate = new Date(event.start);
        return (
            event.status === Status.APPROVED && eventStartDate >= firstDayOfMonth && eventStartDate <= lastDayOfMonth
        );
    }).length;
    const completedAllEvent = events.filter((event) => {
        const eventEndDate = new Date(event.end);
        return event.status === Status.APPROVED && eventEndDate <= currentDate;
    }).length;
    const completedEventsLastMonth = events.filter((event) => {
        const eventStartDate = new Date(event.start);
        const eventEndDate = new Date(event.end);
        return (
            event.status === Status.APPROVED && eventStartDate >= previousMonthStart && eventEndDate <= previousMonthEnd
        );
    }).length;
    const getNextEvent = () => {
        const upcomingEvents = events.filter((event) => new Date(event.start) >= currentDate);
        upcomingEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
        return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
    };

    const getCurrentEvent = () => {
        return events.find(
            (event) =>
                event.status === Status.APPROVED &&
                new Date(event.start) <= currentDate &&
                new Date(event.end) >= currentDate,
        );
    };

    const getAllParticipantsCount = () => {
        return events.reduce(
            (total, event) => total + (event.status === Status.APPROVED ? event.participantsCount : 0),
            0,
        );
    };
    const result = countApplicationsForPieChart(events);
    const getAllParticipantCountLastMonth = events.reduce((total, event) => {
        const eventStartDate = new Date(event.start);
        const eventEndDate = new Date(event.end);
        const isLastMonthEvent =
            (eventStartDate >= previousMonthStart && eventStartDate <= previousMonthEnd) ||
            (eventEndDate >= previousMonthStart && eventEndDate <= previousMonthEnd) ||
            (eventStartDate <= previousMonthStart && eventEndDate >= previousMonthEnd);
        return total + (isLastMonthEvent && event.status === Status.APPROVED ? event.participantsCount : 0);
    }, 0);
    const getPopularLevel = () => {
        const levelCounts: Record<EventLevel, number> = events.reduce(
            (counts, event) => {
                if (event.status === Status.APPROVED) {
                    const level = event.level;
                    counts[level] = counts[level] + 1;
                }
                return counts;
            },
            { REGION: 0, FEDERAL_DISTRICT: 0, ALL_RUSSIA: 0 },
        );
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
    const allParticipantsCount = getAllParticipantsCount();
    const popularDiscipline = getPopularLevel();
    const currentEvent = getCurrentEvent();
    const nextEvent = getNextEvent();
    const timeToNextEvent = nextEvent
        ? Math.ceil((new Date(nextEvent.start).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) // Разница в днях
        : null;

    return (
        <div className="space-y-6">
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="break-inside-avoid">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Всего заявок</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{events.length}</div>
                        <p className="text-muted-foreground text-xs">{pendingEventsCount} на рассмотрении</p>
                    </CardContent>
                </Card>
                <Card className="break-inside-avoid">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Утвержденные соревнования</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{approvedEventsCount}</div>
                        <p className="text-muted-foreground text-xs">{approvedEventsCountMonth} в этом месяце</p>
                    </CardContent>
                </Card>
                <Card className="break-inside-avoid">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Проведенные соревнования</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedAllEvent}</div>
                        <p className="text-muted-foreground text-xs">{completedEventsLastMonth} с прошлого месяца</p>
                    </CardContent>
                </Card>
                <Card className="break-inside-avoid">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ближайшее событие</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {currentEvent ? (
                            <>
                                <div className="text-2xl font-bold">Сейчас идёт</div>
                                <p className="text-muted-foreground text-xs">{currentEvent.title}</p>
                            </>
                        ) : nextEvent ? (
                            <>
                                <div className="text-2xl font-bold">{timeToNextEvent} дней</div>
                                <p className="text-muted-foreground text-xs">{nextEvent.title}</p>
                            </>
                        ) : (
                            <>
                                <div className="text-2xl font-bold">Нет событий</div>
                                <p className="text-muted-foreground text-xs">Пока нет запланированных событий</p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="break-inside-avoid">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Всего спортсменов</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{allParticipantsCount}</div>
                        <p className="text-muted-foreground text-xs">
                            +{getAllParticipantCountLastMonth} с прошлого месяца
                        </p>
                    </CardContent>
                </Card>
                <Card className="break-inside-avoid">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Популярные виды соревнований</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{popularDiscipline}</div>
                    </CardContent>
                </Card>
                <Card className="break-inside-avoid">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Виды событий</CardTitle>
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
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="break-inside-avoid">
                    <CardHeader>
                        <CardTitle>Статистика по заявкам</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={result}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#3B83F6"
                                    label={(entry: { name: string; value: string }) => `${entry.name}: ${entry.value}`}
                                    stroke="none"
                                >
                                    {result.map((entry, index) => {
                                        // Определение цвета для каждого сегмента
                                        const fillColor =
                                            entry.name === "Принято"
                                                ? "#3B83F6" // Синий (как у BarChart)
                                                : entry.name === "Ожидание"
                                                  ? "#FFBB28" // Оранжевый
                                                  : "#FF6384"; // Красный
                                        return <Cell key={`cell-${index}`} fill={fillColor} />;
                                    })}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="break-inside-avoid">
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
        </div>
    );
}
