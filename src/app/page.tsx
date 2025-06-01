import { platformFeatures } from "@/config/landing";

export default function Home() {
    return (
        <main className="space-y-6 pt-52 pb-10 lg:pt-48">
            <div className="mx-auto w-full max-w-screen-xl">
                <section className="flex flex-col items-center gap-10 text-center">
                    <div>
                        <h1 className="font-satoshi bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-[48px] leading-[1.15] font-black tracking-tight text-balance text-transparent sm:text-[56px] md:text-[80px] md:leading-[1.15]">
                            FSPodium
                        </h1>
                        <h2 className="font-satoshi text-[48px] leading-[1.15] font-black tracking-tight text-balance sm:text-[56px] md:text-[64px] md:leading-[1.15]">
                            Платформа координации ФСП и регионов
                        </h2>
                    </div>
                    <p className="text-muted-foreground max-w-2xl text-lg text-balance sm:text-lg md:text-xl">
                        Цель проекта — создание платформы, которая улучшит координацию между ФСП и регионами, упростит
                        процессы подачи и обработки заявок, а также повысит качество общения и управления данными.
                    </p>
                </section>
                <section className="container flex max-w-6xl flex-col gap-8 pt-32">
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-xl font-semibold text-transparent">
                            Основные функции платформы
                        </div>
                    </div>
                    <div className="column-1 gap-5 space-y-5 md:columns-2">
                        {platformFeatures.map((feature, index) => (
                            <div className="break-inside-avoid" key={index}>
                                <div className="bg-muted/25 relative rounded-xl border">
                                    <div className="flex flex-col px-4 py-5 sm:p-6">
                                        <div className="space-y-2">
                                            <p className="text-foreground font-semibold">{feature.title}</p>
                                            <p className="text-muted-foreground">{feature.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
