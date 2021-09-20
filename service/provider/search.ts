import { SEARCH_BASE_URL } from "../../constants/services";

export interface IPage {
  id: string;
  repo: string;
  branch: string;
  path: string;
  title: string;
  content: string;
}

export class SearchProvider {
  serviceUrl = SEARCH_BASE_URL;

  searchPath = "search";

  search(query: string): Promise<void | IPage[]> {
    var requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow",
    };

    var url = new URL(`${this.serviceUrl}/${this.searchPath}`);

    var params = { query };

    url.search = new URLSearchParams(params).toString();

    return fetch(url.toString(), requestOptions)
      .then((response) => response.json())
      .then((json: IPage[]) => json)
      .catch(console.log);
  }
}
