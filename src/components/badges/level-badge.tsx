import { EventLevel } from "@/app/generated/prisma";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
    level: keyof typeof EventLevel;
}

const levelClasses: Record<keyof typeof EventLevel, string> = {
    ALL_RUSSIA: "bg-purple-100 text-purple-800",
    FEDERAL_DISTRICT: "bg-orange-100 text-orange-800",
    REGION: "bg-teal-100 text-teal-800",
};

const levelLabels: Record<keyof typeof EventLevel, string> = {
    ALL_RUSSIA: "Всероссийское",
    FEDERAL_DISTRICT: "Окружное",
    REGION: "Региональное",
};

export function LevelBadge({ level }: LevelBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                levelClasses[level],
            )}
        >
            {levelLabels[level]}
        </span>
    );
}
