import bcrypt from "bcryptjs";

import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { UserRole } from "@/app/generated/prisma";
import { getUserByEmail, linkAccount } from "@/data/user";
import { LoginSchema } from "@/lib/schemas";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const validatedFields = await LoginSchema.safeParseAsync(credentials);
                if (!validatedFields.success) {
                    return null;
                }
                const { email, password } = validatedFields.data;

                const user = await getUserByEmail(email);
                if (!user?.password) {
                    return null;
                }
                const passwordsMatch = await bcrypt.compare(password, user.password);
                if (!passwordsMatch) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user as User | undefined) {
                token.id = user.id;
                token.role = user.role;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        session({ session, token }) {
            if (token.role && token.id) {
                session.user.id = token.id as string;
                session.user.role = token.role as UserRole;
                session.user.name = token.name ?? null;
                session.user.email = token.email!;
            }

            session.user.id = token.id as string;
            session.user.name = token.name ?? null;
            session.user.email = token.email!;
            session.user.role = token.role as UserRole;

            return session;
        },
        redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    },
    events: {
        async linkAccount({ user }) {
            await linkAccount(user as User);
        },
    },
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
        error: "/auth-error",
    },

    secret: process.env.NEXTAUTH_SECRET,
};
