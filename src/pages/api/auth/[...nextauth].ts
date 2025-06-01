import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

// Extend User type to include accessToken
declare module "next-auth" {
  interface User {
    accessToken?: string;
  }
  interface Session {
    accessToken?: string;
  }
}

export default NextAuth({
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.CLIENTID!,
      clientSecret: process.env.CLIENTSECRET!,
    }),

    // Credentials (Email/Password) Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@mail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );
          if (res.data && res.data.accessToken) {
            return {
              ...res.data.user,
              accessToken: res.data.accessToken,
            };
          }
        } catch (error) {
          console.error("Login error:", error);
          throw new Error("Invalid email or password");
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Send Google user details to NestJS API to create/get a user and receive JWT
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/user/google`,
            {
              email: user.email,
              googleId: user.id,
              fullName: user.name || "",
            },
            { timeout: 10000 }
          );
          if (res.data.accessToken) {
            user.accessToken = res.data.accessToken;
            user.email = res.data.email;
            return true;
          }
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token, user }) {
      session.accessToken = token.accessToken as string | undefined;
      session.user = user;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
  },

  secret: "VPrHBczgEZdJQxzleeOkorzpMeiBftjkwwfDRDorfDg=",
  session: {
    strategy: "jwt",
  },
});
