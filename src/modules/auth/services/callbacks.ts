import type { Session, User, Account } from "next-auth";
import type { JWT } from "next-auth/jwt";

// add accesstoken into session if it exists
export function getSession(session: Session, token: User | JWT) {
  // Add access_token to session
  if (token?.accessToken) {
    session.accessToken = token.accessToken;
  }

  return session;
}

// persist accesstoken into jwt token
export function getJwt(token: JWT, account: Account | undefined) {
  // Initial sign in
  if (account) {
    token.accessToken = account.access_token;
  }

  return token;
}
