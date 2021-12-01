import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { getAdapter } from "../../../modules/auth/services/adapter";
import { getJwt, getSession } from "../../../modules/auth/services/callbacks";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: { scope: "read:org" },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token, user }) {
      return getSession(session, token);
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return getJwt(token, account);
    },
  },
  adapter: getAdapter(),
  debug: true,
  secret: process.env.NEXTAUTH_SECRET
});
