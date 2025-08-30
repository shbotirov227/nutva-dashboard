
import NextAuth, { DefaultSession, DefaultUser, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email va parol kiritilishi shart");
        }

        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Auth/login`, {
            email: credentials.email,
            password: credentials.password,
          }, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          const user = res.data;
          if (user && user.token) {
            return {
              id: user.id || user.email || credentials.email,
              email: user.email || credentials.email,
              token: user.token,
            };
          }
          throw new Error(user.message || "Noto'g'ri email yoki parol");
        } catch (error) {
          const errorMessage = (error as any).response?.status === 404
            ? `Serverda endpoint topilmadi: ${process.env.NEXT_PUBLIC_API_URL}/Auth/login`
            : (error as any).response?.data?.message || (error as Error).message;
          throw new Error(`Tizimga kirishda xatolik: ${errorMessage}`);
        }
      },
    }),
  ],
  pages: {
    signIn: "/(auth)/login",
    error: "/(auth)/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
        session.user = {
          ...session.user,
          id: token.sub,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);