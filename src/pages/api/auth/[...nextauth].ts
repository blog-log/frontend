import NextAuth from "next-auth";
import type { Session, User, Account } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Providers from "next-auth/providers";
import { getAdapter } from "../../../modules/auth/services/adapter";
import { getJwt, getSession } from "../../../modules/auth/services/callbacks";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: "read:org",
    }),
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    async session(session: Session, token: User | JWT) {
      return getSession(session, token);
    },
    async jwt(token: JWT, user: User, account: Account) {
      return getJwt(token, user, account);
    },
  },
  adapter: getAdapter(),
  debug: true,
});
