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
    var requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow",
    };

    var url = new URL(this.searchDocumentUrl);

    var params = { query };

    url.search = new URLSearchParams(params).toString();

    return fetch(url.toString(), requestOptions)
      .then((response) => response.json())
      .then((json: IPage[]) => json)
      .catch(console.log);
  }
}
