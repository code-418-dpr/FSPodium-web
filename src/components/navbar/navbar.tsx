"use client";

import Image from "next/image";
import Link from "next/link";

import { User, UserRole } from "@/app/generated/prisma";
import { UserButton } from "@/components/auth/user-button";
import { MobileNavbar } from "@/components/navbar/mobile-navbar";
import { NavbarLink } from "@/components/navbar/navbar-link";
import { siteConfig } from "@/config/site";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

export function Navbar({
    user,
}: {
    user?: Partial<
        User & {
            role: UserRole;
        }
    >;
}) {
    const scrolled = useScroll(50);

    const links: { href: string; label: string }[] = [];

    if (user?.role === UserRole.REGIONAL_REP) {
        links.push({ href: "/admin", label: "Панель администратора" });
    } else if (user?.role === UserRole.STRUCTURAL_UNIT) {
        links.push({ href: "/regional", label: "Управление представительством" });
    }

    if (user) {
        links.push({ href: "/settings", label: "Настройки" });
    }

    links.push(...siteConfig.navLinks);

    return (
        <div
            className={cn(
                "fixed top-0 right-0 left-0 z-50 print:static",
                scrolled && "border-border border-b backdrop-blur-xl",
            )}
        >
            <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 rounded-xl p-4 md:gap-10">
                <Link className="flex items-center gap-2" href="/">
                    <Image src="/logo.svg" alt="FSPodium" width={28} height={28} />
                    <span className="text-xl font-bold">FSPodium</span>
                </Link>
                <div className="hidden flex-1 justify-between md:flex">
                    <div className="flex flex-1 items-center gap-6">
                        {links.map((link) => (
                            <NavbarLink key={link.href} href={link.href}>
                                {link.label}
                            </NavbarLink>
                        ))}
                    </div>
                    <UserButton user={user} />
                </div>
                <div className="flex md:hidden">
                    <MobileNavbar links={links} />
                </div>
            </div>
        </div>
    );
}
