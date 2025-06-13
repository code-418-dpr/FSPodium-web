"use client";

import { ArrowRightIcon, FlameIcon, MenuIcon } from "lucide-react";

import { useState } from "react";

import { signOut } from "next-auth/react";
import Link, { LinkProps } from "next/link";

import { UserAvatar } from "@/components/auth/user-avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface Props {
    links: { href: string; label: string }[];
}

export function MobileNavbar({ links }: Props) {
    const [open, setOpen] = useState(false);
    const user = useAuth().user;

    const MobileLink = ({
        href,
        className,
        children,
        ...props
    }: {
        onClick?: () => void;
        children: React.ReactNode;
        className?: string;
    } & LinkProps) => {
        return (
            <Link
                href={href}
                onClick={() => {
                    setOpen(false);
                }}
                className={cn(className)}
                {...props}
            >
                {children}
            </Link>
        );
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="p-1">
                    <MenuIcon />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
                <MobileLink href="/" className="flex items-center">
                    <FlameIcon className="mr-2 h-4 w-4" />
                    <span className="font-bold">Code 418</span>
                </MobileLink>
                <ScrollArea className="my-4 h-[calc(100vh-8rem)] px-6 pb-10">
                    <div className="flex flex-col space-y-3 pb-4">
                        {links.map(
                            (item) =>
                                item.href && (
                                    <MobileLink key={item.href} href={item.href}>
                                        {item.label}
                                    </MobileLink>
                                ),
                        )}
                    </div>
                    <Separator className="mb-4" />
                    {user ? (
                        <div className="flex flex-col space-y-3">
                            <div className="flex w-full items-center justify-between gap-4">
                                <div className="flex-1 truncate">
                                    <span className="flex-1 truncate font-bold">{user.name ?? user.email}</span>
                                </div>
                                <UserAvatar className="size-8" />
                            </div>
                            <MobileLink href="/settings">Настройки</MobileLink>
                            <Button
                                variant="ghost"
                                className="h-auto w-full justify-start p-0 text-base font-normal hover:bg-transparent"
                                onClick={() => {
                                    void signOut();
                                }}
                            >
                                Выйти
                            </Button>
                        </div>
                    ) : (
                        <MobileLink href="/login" className={cn(buttonVariants(), "w-full gap-2")}>
                            Войти
                            <ArrowRightIcon className="size-4" />
                        </MobileLink>
                    )}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
