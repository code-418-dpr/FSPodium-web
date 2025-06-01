import "next-auth";

import { UserRole } from "@/app/generated/prisma";

declare module "next-auth" {
    interface User {
        id: string;
        name: string | null;
        email: string;
        role: UserRole;
    }

    interface Session {
        user: User;
    }
}
