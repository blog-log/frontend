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
export function getJwt(token: JWT, user: User, account: Account) {
  // Initial sign in
  if (account && user) {
    token.accessToken = account.accessToken;
    return token;
  }

  return token;
}
