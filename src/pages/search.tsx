import { Layout, Card, Empty, Typography } from "antd";
import Link from "next/link";
import { IPage, SearchProvider } from "../modules/search/services/search";
import { GetServerSideProps } from "next";
import { getRepoSlug } from "../common/utils/path";
import removeMarkdown from "remove-markdown";
import fm from "front-matter";
import { DeviceType } from "../common/utils/device";
import Header from "../common/components/elements/Header/Header";
import { getSession } from "next-auth/react";

const { Content } = Layout;
const { Paragraph } = Typography;

interface ISearch {
  pages?: IPage[];
  error?: Error;
  deviceType: DeviceType;
}

function Search(props: ISearch) {
  return (
    <Layout>
      <Header deviceType={props.deviceType} />
      <Content className="p-2 md:p-6 lg:p-12">
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
                    <Paragraph ellipsis={{ rows: 3, expandable: false }}>
                      {removeMarkdown(fm<string>(page.content).body, {
                        stripListLeaders: true, // strip list leaders (default: true)
                        listUnicodeChar: "", // char to insert instead of stripped list leaders (default: '')
                        gfm: true, // support GitHub-Flavored Markdown (default: true)
                        useImgAltText: true, // replace images with alt-text, if present (default: true)
                      })}
                    </Paragraph>
                  </Card>
                </a>
              </Link>
            ))}
          {(!props.pages || props.pages.length === 0) && <Empty />}
        </div>
      </Content>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query["query"]?.toString();

  const searchProvider = new SearchProvider();

  const pages = await searchProvider.search(query || "");

  return {
    props: {
      session: await getSession(context),
      ...(pages && { pages }),
      ...(!pages && { error: new Error("no pages found") }),
    },
  };
};

export default Search;
