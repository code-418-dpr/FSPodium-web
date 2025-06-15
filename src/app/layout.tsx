import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";

import AuthProvider from "@/components/auth/auth-provider";
import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";
import { ThemeProvider } from "@/components/theming/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { authOptions } from "@/lib/auth-options";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: siteConfig.name,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="ru" suppressHydrationWarning>
            <body className={cn(inter.className, "min-h-screen")}>
                <AuthProvider session={session}>
                    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                        <Toaster />
                        <div className="bg-background flex min-h-full w-full flex-col pt-16">
                            <Navbar
                                user={
                                    session?.user
                                        ? {
                                              ...session.user,
                                              name: session.user.name ?? undefined,
                                              email: session.user.email,
                                          }
                                        : undefined
                                }
                            />
                            <div className="min-h-[80vh]">{children}</div>
                            <Footer />
                        </div>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
