import { UserIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function UserAvatar({ className }: { className?: string }) {
    return (
        <Avatar className={cn(className)}>
            <AvatarFallback className="border border-white/20 bg-transparent">
                <UserIcon className="text-white" />
            </AvatarFallback>
        </Avatar>
    );
}
