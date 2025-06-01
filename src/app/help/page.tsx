import { ClockIcon, FileTextIcon, Mail, PhoneIcon } from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpPage() {
    const documents = [
        {
            title: "Правила вида спорта",
            href: "/documents/rules.pdf",
        },
        {
            title: "Изменения в правилах",
            href: "/documents/rules-changes.pdf",
        },
        {
            title: "Документы для участия в соревнованиях",
            href: "/documents/docs.pdf",
        },
    ];

    return (
        <div className="p-6 md:p-8 lg:p-12">
            <div className="mx-auto max-w-5xl space-y-8">
                <h1 className="text-primary text-center text-3xl font-bold tracking-tight md:text-4xl">
                    Справочная информация
                </h1>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-primary/20 bg-card">
                        <CardHeader>
                            <CardTitle className="text-primary flex items-center gap-2">
                                <PhoneIcon className="h-5 w-5" />
                                Контакты поддержки
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="text-primary h-5 w-5" />
                                <div>
                                    <p className="text-muted-foreground text-sm">Email:</p>
                                    <a
                                        href="mailto:support@federation.ru"
                                        className="hover:text-primary hover:underline"
                                    >
                                        support@federation.ru
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <PhoneIcon className="text-primary h-5 w-5" />
                                <div>
                                    <p className="text-muted-foreground text-sm">Телефон:</p>
                                    <a href="tel:+79991234567" className="hover:text-primary hover:underline">
                                        +7 (999) 123-45-67
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <ClockIcon className="text-primary h-5 w-5" />
                                <div>
                                    <p className="text-muted-foreground text-sm">Время работы:</p>
                                    <p>Пн-Пт, 9:00 - 18:00</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-primary/20 bg-card">
                        <CardHeader>
                            <CardTitle className="text-primary flex items-center gap-2">
                                <FileTextIcon className="h-5 w-5" />
                                Основные документы
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {documents.map((doc) => (
                                <Button
                                    asChild
                                    key={doc.href}
                                    variant="outline"
                                    className="hover:bg-primary/10 h-auto w-full justify-start gap-2 px-3 py-2"
                                >
                                    <Link href={doc.href} className="flex items-center gap-2">
                                        <FileTextIcon className="h-4 w-4" />
                                        {doc.title}
                                    </Link>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
