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
        const startDate = new Date(2024, 0, 1);
        const endDate = new Date(2024, 11, 31);
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
    } catch (error) {
        console.error("Error populating database:", error);
    } finally {
        await db.$disconnect();
    }
    console.log("Database populated successfully.");
}

void seed();
