import { Card, Empty } from "antd";
import Link from "next/link";
import { IPage, SearchProvider } from "../modules/search/services/search";
import { GetServerSideProps } from "next";
import { getRepoSlug } from "../common/utils/path";

interface ISearch {
  pages?: IPage[];
  error?: Error;
}

function Search(props: ISearch) {
  return (
    <div className="bg-white p-1 md:p-8 mb-4 md:mb-8 lg:mb-12">
      {props.pages &&
        props.pages.length > 0 &&
        props.pages.map((page, index) => (
          <Link
            key={`${index}-${page.repo}-${page.path}`}
            href={getRepoSlug(page)}
            passHref={true}
          >
            <a>
              <Card
                className="m-8"
                key={`${index}-${page.repo}-${page.path}`}
                hoverable
                title={page.title}
              >
                content description
              </Card>
            </a>
          </Link>
        ))}
      {(!props.pages || props.pages.length === 0) && <Empty />}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query["query"]?.toString();

  const searchProvider = new SearchProvider();

  const pages = await searchProvider.search(query || "");

  var props: ISearch;
  if (pages !== undefined) {
    props = { pages };
  } else {
    props = { error: new Error("no pages found") };
  }

  return { props };
};

export default Search;
