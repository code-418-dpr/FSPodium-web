import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { UserRole } from "@/app/generated/prisma";

const protectedRoutes = ["/history", "/recommendations", "/settings"];

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        const loginUrl = new URL("/", request.url);
        if (!token) {
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
        if (token.role !== UserRole.STRUCTURAL_UNIT) {
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

// // Optionally, don't invoke Middleware on some paths
// export const config = {
//     matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };
