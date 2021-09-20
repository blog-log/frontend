import { GithubProvider } from "../service/provider/github";
import { SessionWithToken } from "../types/session";

export enum UserProgress {
  Initial = -1, // user hasn't done anything yet
  SignedUp = 0, // user signed up but has not installed github app
  Done = 1, // user has finished setup
}

export const getCurrentProgress = async (
  session: SessionWithToken | null
): Promise<UserProgress> => {
  if (session && !session?.error && session?.accessToken) {
    // user signed in -- determine if installed app yet
    const githubProvider = new GithubProvider(session?.accessToken as string);

    const accessibleInstallations = await githubProvider.getInstallations();

    if (!accessibleInstallations || accessibleInstallations.length === 0) {
      // has no access to any github app installation yet
      return UserProgress.SignedUp;
    }

    // has access to github app installation
    return UserProgress.Done;
  }

  // not signed in
  return UserProgress.Initial;
};
