import { Prisma } from "@/app/generated/prisma";

export type UnitWithUser = Prisma.UnitGetPayload<{
    include: {
        user: true;
    };
}>;

export type ExtendedEvent = Prisma.EventGetPayload<{
    include: {
        resultEvents: true;
        unit: {
            include: {
                user: true;
            };
        };
        disciplines: true;
        sportObject: true;
    };
}>;
