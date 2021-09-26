import { repoIdToName, repoNameToId } from "../adapter/repo";

export interface IDocument {
  id: string;
  repo: string;
  branch: string;
  path: string;
  title: string;
}

export interface IRepo {
  id: string;
  error: any;
  warning: (string | null)[];
}

interface DocumentSearchResponse {
  status: number;
  message: string;
  data: IDocument[];
}

interface RepoSearchResponse {
  status: number;
  message: string;
  data: IRepo[];
}

export class RepoProvider {
  documentSearchUrl = `${process.env.DATASTORE_URL}/document/search`;
  repoSearchUrl = `${process.env.DATASTORE_URL}/repo/search`;

  searchDocuments(repos?: string[]): Promise<void | IDocument[]> {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    var requestOptions: RequestInit = {
      method: "POST",
      redirect: "follow",
      headers,
      body: JSON.stringify({
        repos,
      }),
    };

    var url = new URL(this.documentSearchUrl);

    return fetch(url.toString(), requestOptions)
      .then((response) => response.json())
      .then((json: DocumentSearchResponse) => {
        switch (json.status) {
          case 200:
            return json.data;
          default:
            throw new Error(json.message);
        }
      })
      .catch(console.log);
  }

  searchRepos(repos?: string[]): Promise<void | IRepo[]> {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    const repoIds = repos?.map((repoName) => repoNameToId(repoName));

    var requestOptions: RequestInit = {
      method: "POST",
      redirect: "follow",
      headers,
      body: JSON.stringify({
        repos: repoIds,
      }),
    };

    var url = new URL(this.repoSearchUrl);

    return fetch(url.toString(), requestOptions)
      .then((response) => response.json())
      .then((json: RepoSearchResponse) => {
        switch (json.status) {
          case 200:
            const repos = json.data.map((repo) => {
              repo.id = repoIdToName(repo.id);
              return repo;
            });

            return repos;
          default:
            throw new Error(json.message);
        }
      })
      .catch(console.log);
  }
}
