import ReactMarkdown, { PluggableList } from "react-markdown";
import gfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import deepmerge from "deepmerge";
import fm, { FrontMatterResult } from "front-matter";
import { GetServerSideProps } from "next";

import styles from "../common/styles/page.module.scss";

const schema = deepmerge(defaultSchema, { tagNames: ["customtagshere"] });

interface IPage {
  content: FrontMatterResult<string>;
}

function Page(props: IPage) {
  return (
    <div className="bg-white p-2 md:p-8 m-0 md:m-auto w-full md:w-7/12">
      {props.content && props.content.body && (
        <ReactMarkdown
          className={`${styles.body} prose lg:prose-2xl`}
          remarkPlugins={[gfm] as PluggableList}
          rehypePlugins={[rehypeRaw, rehypeSanitize(schema)] as PluggableList}
        >
          {props.content.body}
        </ReactMarkdown>
      )}
    </div>
  );
}

function getRepoRaw(path: string): string {
  const splitPath = path.split("/");
  splitPath.shift();
  splitPath.shift();
  const slug = `https://raw.githubusercontent.com/${splitPath.join("/")}`;
  return slug;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data from external API
  const url = getRepoRaw(context.resolvedUrl);

  const res = await fetch(url);
  const text = await res.text();
  const content = fm<string>(text);

  return { props: { content } };
};

export default Page;
