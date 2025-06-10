import { EventLevel, Status, UserRole } from "@/app/generated/prisma";
import { createStructuralUnit } from "@/data/structural-unit";
import { createUser } from "@/data/user";
import db from "@/lib/db";

import eventTitles from "./event-titles.json";

async function seed() {
    const users = [
        {
            name: "Admin",
            email: "admin@ya.ru",
            phone: 9491234567n,
            password: "admin",
            role: UserRole.REGIONAL_REP,
        },
        {
            name: "Сергей",
            email: "region1@fsp-russia.com",
            phone: 9491234568n,
            password: "11111111",
            role: UserRole.STRUCTURAL_UNIT,
        },
        {
            name: "Алекс",
            email: "region2@fsp-russia.com",
            phone: 9491234569n,
            password: "11111111",
            role: UserRole.STRUCTURAL_UNIT,
        },
        {
            name: "Тест",
            email: "region3@fsp-russia.com",
            phone: 9491234560n,
            password: "11111111",
            role: UserRole.STRUCTURAL_UNIT,
        },
        {
            name: "Тест",
            email: "region4@fsp-russia.com",
            phone: 9491234561n,
            password: "11111111",
            role: UserRole.STRUCTURAL_UNIT,
        },
    ];

    const userIds = [];
    const unitIds = [];

    try {
        for (const user of users) {
            const createdUser = await createUser(
                user.name,
                user.phone,
                user.email,
                user.password,
                user.role,
                false,
                false,
            );
            if (user.role === UserRole.STRUCTURAL_UNIT) {
                userIds.push(createdUser.id);
            }
        }

        for (let i = 1; i < 4; i++) {
            const unit = await createStructuralUnit(`Подразделение ${i}`, `Адрес ${i}`, userIds[i]);
            unitIds.push(unit.id);
        }

        const eventStatuses: Status[] = [Status.PENDING, Status.APPROVED, Status.COMPLETED, Status.REFUSED];
        const startDate = new Date(2025, 0, 1);
        const endDate = new Date(2025, 11, 31);
        const ageRanges = ["16+", "18+", "14-17", "21+", "18-21"];
        const eventLevels: EventLevel[] = [EventLevel.ALL_RUSSIA, EventLevel.FEDERAL_DISTRICT, EventLevel.REGION];

        for (let i = 0; i < 50; i++) {
            const randomUnitIndex = Math.floor(Math.random() * unitIds.length);
            const eventStartDate = new Date(
                startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()),
            );
            const eventEndDate = new Date(eventStartDate.getTime() + Math.random() * (7 * 24 * 60 * 60 * 1000));

            const randomAgeRangeIndex = Math.floor(Math.random() * ageRanges.length);
            const eventLevel = eventLevels[Math.floor(Math.random() * eventLevels.length)];
            const participantsCount = Math.floor(Math.random() * 100) + 1;
            const status = eventStatuses[Math.floor(Math.random() * eventStatuses.length)];
            const refusalReason = status === Status.REFUSED ? "-" : null;
            const title = eventTitles[Math.floor(Math.random() * eventTitles.length)];

            await db.event.create({
                data: {
                    title,
                    ageRange: ageRanges[randomAgeRangeIndex],
                    start: eventStartDate,
                    end: eventEndDate,
                    isOnline: true,
                    level: eventLevel,
                    participantsCount,
                    unitId: unitIds[randomUnitIndex],
                    sportObjectsId: null,
                    refusalReason,
                    status,
                },
            });
        }

        await db.user.update({
            where: { email: "admin@ya.ru" },
            data: { tgId: 1234567890n },
        });
        await db.user.update({
            where: { email: "region1@fsp-russia.com" },
            data: { tgId: 9876543210n },
        });

        const unitRequests = [
            {
                name: "Заявка Подразделение A",
                address: "Адрес A",
                username: "Иван Иванов",
                email: "request1@example.com",
                phone: 9001112233n,
                status: Status.PENDING,
            },
            {
                name: "Заявка Подразделение B",
                address: "Адрес B",
                username: "Петр Петров",
                email: "request2@example.com",
                phone: 9004445566n,
                status: Status.APPROVED,
            },
            {
                name: "Заявка Подразделение C",
                address: "Адрес C",
                username: "Сидор Сидоров",
                email: "request3@example.com",
                phone: 9007778899n,
                status: Status.REFUSED,
                refusalReason: "Недостаточная информация",
            },
        ];

        for (const request of unitRequests) {
            await db.unitRequest.create({ data: request });
        }

        // 3. Создаем команды (Team) для каждого подразделения
        const teams = [];
        for (const unitId of unitIds) {
            const teamCount = Math.floor(Math.random() * 3) + 1; // 1-3 команды
            for (let j = 1; j <= teamCount; j++) {
                const team = await db.team.create({
                    data: {
                        name: `Команда ${j} Подразделения ${unitId.slice(0, 5)}`,
                        trainer: `Тренер ${j}`,
                        representative: `Представитель ${j}`,
                        unitId: unitId,
                    },
                });
                teams.push(team);
            }
        }

        // 4. Создаем спортсменов (Sportsman) для каждой команды
        for (const team of teams) {
            const sportsmanCount = Math.floor(Math.random() * 3) + 1; // 1-3 спортсмена
            for (let k = 1; k <= sportsmanCount; k++) {
                const birthYear = 2000 + Math.floor(Math.random() * 10);
                const birthMonth = Math.floor(Math.random() * 12);
                const birthDay = Math.floor(Math.random() * 28) + 1;

                await db.sportsman.create({
                    data: {
                        name: `Спортсмен ${k} Команды ${team.id.slice(0, 5)}`,
                        bdate: new Date(birthYear, birthMonth, birthDay),
                        isMale: Math.random() > 0.5,
                        teams: {
                            connect: [{ id: team.id }],
                        },
                    },
                });
            }
        }

        // 5. Создаем спортивные объекты (SportObject)
        const sportObjects = [
            { name: "Стадион 'Олимп'", address: "ул. Спортивная, 1" },
            { name: "Дворец спорта", address: "пр. Победы, 25" },
            { name: "Ледовая арена", address: "ул. Зимняя, 7" },
        ];

        const sportObjectIds = [];
        for (const obj of sportObjects) {
            const created = await db.sportObject.create({ data: obj });
            sportObjectIds.push(created.id);
        }

        // 6. Создаем дисциплины (Discipline)
        const disciplines = [
            { id: "d1", name: "Футбол" },
            { id: "d2", name: "Баскетбол" },
            { id: "d3", name: "Волейбол" },
        ];

        for (const disc of disciplines) {
            await db.discipline.create({ data: disc });
        }

        // 7. Создаем планы (Plan) для подразделений
        for (const unitId of unitIds) {
            const planCount = Math.floor(Math.random() * 3) + 1; // 1-3 плана
            for (let p = 1; p <= planCount; p++) {
                await db.plan.create({
                    data: {
                        year: 2025 + p,
                        status: Status.PENDING,
                        unitId: unitId,
                    },
                });
            }
        }

        // 8. Создаем результаты событий (ResultEvent)
        const allEvents = await db.event.findMany();
        for (let i = 0; i < 10; i++) {
            // Для 10 случайных событий
            const randomEvent = allEvents[Math.floor(Math.random() * allEvents.length)];
            const resultCount = Math.floor(Math.random() * 3) + 1; // 1-3 результата

            for (let r = 0; r < resultCount; r++) {
                await db.resultEvent.create({
                    data: {
                        fileName: `result_${randomEvent.id.slice(0, 5)}_${r}.pdf`,
                        filePath: `/uploads/results/${randomEvent.id}_${r}.pdf`,
                        eventId: randomEvent.id,
                        unitId: randomEvent.unitId || undefined,
                    },
                });
            }
        }

        // 9. Создаем уведомления (Notification) для пользователей
        const allUsers = await db.user.findMany();
        for (const user of allUsers) {
            const notificationCount = Math.floor(Math.random() * 3) + 1; // 1-3 уведомления
            for (let n = 1; n <= notificationCount; n++) {
                await db.notification.create({
                    data: {
                        title: `Уведомление ${n} для ${user.name}`,
                        message: `Это тестовое уведомление #${n}`,
                        userId: user.id,
                    },
                });
            }
        }

        // 10. Создаем сообщения в поддержку (SupportMessage)
        const tgUsers = await db.user.findMany({
            where: { tgId: { not: null } },
            take: 2,
        });

        for (const user of tgUsers) {
            const messageCount = Math.floor(Math.random() * 2) + 1; // 1-2 сообщения
            for (let m = 1; m <= messageCount; m++) {
                await db.supportMessage.create({
                    data: {
                        tgAuthorId: user.tgId!,
                        request: `Вопрос ${m} от ${user.name}: Как использовать систему?`,
                        response: m % 2 === 0 ? `Ответ на вопрос ${m}` : null,
                        solved: m % 2 === 0,
                    },
                });
            }
        }
    } catch (error) {
        console.error("Error populating database:", error);
    } finally {
        await db.$disconnect();
    }
    console.log("Database populated successfully.");
}

void seed();
