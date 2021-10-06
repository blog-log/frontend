export interface IPage {
  id: string;
  repo: string;
  branch: string;
  path: string;
  title: string;
  content: string;
}

export class SearchProvider {
  searchDocumentUrl = `${process.env.SEARCHER_URL}/document/search`;

  search(query: string): Promise<void | IPage[]> {
    var headers = new Headers();
    headers.append("Content-Type", "application/json");

    var requestOptions: RequestInit = {
      method: "POST",
      redirect: "follow",
      headers,
      body: JSON.stringify({
        query,
      }),
    };

    var url = new URL(this.searchDocumentUrl);

    return fetch(url.toString(), requestOptions)
      .then((response) => response.json())
      .then((json: IPage[]) => json)
      .catch(console.log);
  }
}
