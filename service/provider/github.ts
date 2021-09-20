import { Octokit } from "@octokit/rest";

export interface IInstallation {
  account: string;
  url: string;
}

export class GithubProvider {
  private client: Octokit;

  constructor(accessToken: string) {
    const octokit = new Octokit({
      auth: accessToken,
    });

    this.client = octokit;
  }

  async getInstallations(): Promise<IInstallation[]> {
    try {
      const installationsRes =
        await this.client.apps.listInstallationsForAuthenticatedUser();

      const ids: IInstallation[] = installationsRes.data.installations.map(
        (installation) => {
          return {
            account: installation.account?.login || "unknown",
            url: installation.html_url,
          };
        }
      );

      return ids;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getRepos() {
    try {
      const installationsRes =
        await this.client.apps.listInstallationsForAuthenticatedUser();

      const ids = installationsRes.data.installations.map(
        (installation) => installation.id
      );

      const tmpRepos = await Promise.all(
        ids.map((id) => this._getReposForInstallation(id))
      );

      return tmpRepos.flatMap((tmpRepo) => tmpRepo);
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  private async _getReposForInstallation(
    installationId: number
  ): Promise<string[]> {
    const res =
      await this.client.apps.listInstallationReposForAuthenticatedUser({
        installation_id: installationId,
      });

    return res.data.repositories.map(
      (repo) => `https://github.com/${repo.full_name}`
    );
  }
}
