"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function NavbarLink({ href, children }: { href: string; children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <Link
            className={cn(
                "hover:text-foreground/80 text-sm transition-colors",
                pathname === href ? "text-foreground" : "text-foreground/60",
            )}
            href={href}
        >
            {children}
        </Link>
    );
}
