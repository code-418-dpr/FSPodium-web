import Link from "next/link";

import { RegisterForm } from "@/components/forms/register-form";
import { Button } from "@/components/ui/button";

export default async function RegisterPage(props: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const searchParams = await props.searchParams;
    const loginUrl = `/login${
        Object.keys(searchParams).length > 0
            ? `?${new URLSearchParams(searchParams as Record<string, string>).toString()}`
            : ""
    }`;

    return (
        <div className="flex flex-col items-center gap-8">
            <h1 className="max-w-xl text-center text-3xl leading-snug font-semibold">
                Заявка на регистрацию регионального представителя
            </h1>
            <div className="w-[min(calc(100%-2rem),400px)] space-y-4">
                <RegisterForm />
                <Button variant="link" className="w-full font-normal" size="sm" asChild>
                    <Link href={loginUrl}>Уже есть аккаунт?</Link>
                </Button>
            </div>
        </div>
    );
}
